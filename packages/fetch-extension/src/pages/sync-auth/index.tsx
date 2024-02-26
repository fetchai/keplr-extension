import React, { FunctionComponent, useEffect, useState } from "react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import queryString from "querystring";
import ReactDOM from "react-dom";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { AUTH_SERVER } from "../../config.ui.var";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import {
  GetMultiKeyStoreInfoMsg,
  GetRemoteDeviceNamesMsg,
  GetRemoteVersionMsg,
  SetKrPasswordMsg,
  SyncDeviceMsg,
  UpdateDeviceSyncCredentialsMsg,
} from "@keplr-wallet/background";
import { EmptyLayout } from "@layouts/empty-layout";
import style from "./style.module.scss";
import classnames from "classnames";
import { PasswordInput, Input } from "@components/form";
import "../../styles/global.scss";
import { AppIntlProvider } from "../../languages";
import {
  AdditionalIntlMessages,
  LanguageToFiatCurrency,
} from "../../config.ui";
import { Button } from "reactstrap";

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

const InitSyncData: FunctionComponent<{ email: string }> = observer(
  ({ email }) => {
    const [noRemote, setNoRemote] = useState(false);
    const [deviceName, setDeviceName] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [noRemoteData, setNoRemoteData] = useState(false);
    const [syncComplete, setSyncComplete] = useState(false);
    const [passwordRegistration, setPasswordRegistration] = useState({
      password: "",
      confirmPassword: "",
    });

    const requester = new InExtensionMessageRequester();

    useEffect(() => {
      const getVersion = async () => {
        const version = await requester.sendMessage(
          BACKGROUND_PORT,
          new GetRemoteVersionMsg()
        );

        if (version === 0) {
          setNoRemote(true);
        }
      };

      getVersion();
    }, []);

    if (syncComplete) {
      return (
        <React.Fragment>
          <h1> Hello {email}. Device sync is complete.</h1>
          {noRemoteData && (
            <h1>
              No sync data found, please create a new account. We have signed
              you up for sync anyway
            </h1>
          )}
          <div style={{ flex: 13 }} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Input
          label="Device Name"
          required
          onChange={(e) => {
            e.preventDefault();
            setDeviceName(e.target.value);
          }}
        />
        <PasswordInput
          label="password"
          required
          onChange={(e) => {
            e.preventDefault();
            setPasswordRegistration({
              ...passwordRegistration,
              password: e.target.value,
            });
          }}
          error={
            noRemote && passwordRegistration.password.length < 8
              ? "Password too short"
              : undefined
          }
        />
        {noRemote && (
          <PasswordInput
            label="Confirm password"
            required
            onChange={(e) => {
              e.preventDefault();
              setPasswordRegistration({
                ...passwordRegistration,
                confirmPassword: e.target.value,
              });
            }}
            error={
              passwordRegistration.password !==
              passwordRegistration.confirmPassword
                ? "Password does not match"
                : undefined
            }
          />
        )}
        <Button
          color="primary"
          type="submit"
          block
          size="lg"
          data-loading={submitLoading}
          disabled={
            (noRemote &&
              (passwordRegistration.password.length < 8 ||
                passwordRegistration.password !==
                  passwordRegistration.confirmPassword)) ||
            deviceName === ""
          }
          onClick={() => {
            const submitData = async () => {
              setSubmitLoading(true);
              try {
                const deviceNames = await requester.sendMessage(
                  BACKGROUND_PORT,
                  new GetRemoteDeviceNamesMsg(passwordRegistration.password)
                );

                if (deviceNames.includes(deviceName)) {
                  setSubmitError("Device name not unique");
                  return;
                }

                await requester.sendMessage(
                  BACKGROUND_PORT,
                  new SyncDeviceMsg(passwordRegistration.password, deviceName)
                );

                const { multiKeyStoreInfo } = await requester.sendMessage(
                  BACKGROUND_PORT,
                  new GetMultiKeyStoreInfoMsg()
                );

                setNoRemoteData(multiKeyStoreInfo.length === 0);

                if (multiKeyStoreInfo.length === 0) {
                  await requester.sendMessage(
                    BACKGROUND_PORT,
                    new SetKrPasswordMsg("")
                  );
                }

                setSyncComplete(true);
              } catch (e) {
                // TODO: specific error for password verification and any other error
                setSubmitError("Password verification failed");
              } finally {
                setSubmitLoading(false);
              }
            };

            submitData();
          }}
        >
          Submit
        </Button>
        {submitError && <p>{submitError}</p>}
      </React.Fragment>
    );
  }
);

export const SyncAuthPage: FunctionComponent = observer(() => {
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noRemoteData, setNoRemoteData] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const [email, setEmail] = useState("");

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
          new UpdateDeviceSyncCredentialsMsg(profileResponse.data.email, {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
            refreshExpiresIn: token.refresh_expires_in,
          })
        );

        if (syncStatus.syncPasswordNotAvailable) {
          return setIsInit(true);
        }

        await requester.sendMessage(BACKGROUND_PORT, new SyncDeviceMsg());

        const { multiKeyStoreInfo } = await requester.sendMessage(
          BACKGROUND_PORT,
          new GetMultiKeyStoreInfoMsg()
        );

        setNoRemoteData(multiKeyStoreInfo.length === 0);

        if (multiKeyStoreInfo.length === 0) {
          await requester.sendMessage(
            BACKGROUND_PORT,
            new SetKrPasswordMsg("")
          );
        }
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
    return <h1>Syncing...</h1>;
  }

  if (authError) {
    return <h1>Error setting up device sync</h1>;
  }

  if (isInit) {
    return <InitSyncData email={email} />;
  }

  return (
    <EmptyLayout
      className={classnames(style["container"], {
        large: true,
      })}
      style={{
        backgroundColor: "white",
        padding: 0,
        margin: "auto",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: 10 }} />
      <div className={style["logoContainer"]}>
        <div
          className={classnames(style["logoInnerContainer"], {
            [style["justifyCenter"]]: true,
          })}
        >
          <img
            className={style["icon"]}
            src={require("@assets/logo-256.svg")}
            alt="logo"
          />
          <img
            className={style["logo"]}
            src={require("@assets/brand-text.png")}
            alt="logo"
          />
        </div>
      </div>
      <h1> Hello {email}. Device sync is complete.</h1>
      {noRemoteData && (
        <h1>
          No sync data found, please create a new account. We have signed you up
          for sync anyway
        </h1>
      )}
      <div style={{ flex: 13 }} />
    </EmptyLayout>
  );
});

ReactDOM.render(
  <AppIntlProvider
    additionalMessages={AdditionalIntlMessages}
    languageToFiatCurrency={LanguageToFiatCurrency}
  >
    <SyncAuthPage />
  </AppIntlProvider>,
  document.getElementById("app")
);
