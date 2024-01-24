import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import queryString from "querystring";
import ReactDOM from "react-dom";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { AUTH_SERVER, DEVICE_SYNC_SERVER } from "../../config.ui.var";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import {
  CheckPasswordMsg,
  GetDeviceSyncStatusMsg,
  StartDeviceSyncMsg,
  UpdateDeviceSyncCredentialsMsg,
} from "@keplr-wallet/background";
import { Button } from "reactstrap";
import { PasswordInput } from "@components/form";

type QueryParams = {
  code: string | undefined;
  grant_type: string | undefined;
  scope: string | undefined;
  response_type: string | undefined;
  state: string | undefined;
};

type AccessTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

export const SyncAuthPage: FunctionComponent = observer(() => {
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordNeeded, setPasswordNeeded] = useState(false);

  const requester = new InExtensionMessageRequester();

  useEffect(() => {
    const getProfile = async () => {
      try {
        let search = window.location.search;

        if (!search.startsWith("?")) {
          setAuthError(true);
          return;
        }

        search = search.slice(1);
        const query = queryString.parse(search) as QueryParams;

        if (!query.code) {
          setAuthError(true);
          return;
        }

        const r = await axios.post(
          `${AUTH_SERVER}/v1/tokens`,
          {
            grant_type: "authorization_code",
            code: query.code,
            client_id: "fetch_wallet",
            scope: query.scope,
          },
          {
            headers: { "Access-Control-Allow-Origin": "*" },
          }
        );

        if (r.status !== 200) {
          setAuthError(true);
          return;
        }

        const token: AccessTokenResponse = r.data;

        const profileResponse = await axios.get(`${AUTH_SERVER}/v1/profile`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `bearer ${token.access_token}`,
          },
        });

        if (profileResponse.status !== 200 || !profileResponse.data.email) {
          setAuthError(true);
          return;
        }

        setEmail(profileResponse.data.email);

        const syncStatus = await requester.sendMessage(
          BACKGROUND_PORT,
          new GetDeviceSyncStatusMsg()
        );

        if (syncStatus.passwordNotAvailable) {
          setPasswordNeeded(true);
        }

        await requester.sendMessage(
          BACKGROUND_PORT,
          new UpdateDeviceSyncCredentialsMsg(profileResponse.data.email, {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
            refreshExpiresIn: token.refresh_expires_in,
          })
        );
      } catch (e) {
        console.error(`Error authenticating: ${e}`);
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (authError) {
    return <h1>Error setting up device sync</h1>;
  }

  return (
    <div>
      <h1> Hello {email}</h1>
      {passwordNeeded && (
        <div>
          <PasswordInput
            label={"password"}
            required
            error={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            color="primary"
            block
            data-loading={passwordLoading}
            onSubmit={async () => {
              setPasswordLoading(true);
              try {
                const valid = await requester.sendMessage(
                  BACKGROUND_PORT,
                  new CheckPasswordMsg(password)
                );

                if (!valid) {
                  setPasswordError("Invalid password");
                  return;
                }

                await requester.sendMessage(
                  BACKGROUND_PORT,
                  new StartDeviceSyncMsg(DEVICE_SYNC_SERVER, password)
                );
              } catch (e) {
                setPasswordError("Error validating password");
              } finally {
                setPasswordLoading(false);
              }
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
});

ReactDOM.render(<SyncAuthPage />, document.getElementById("app"));
