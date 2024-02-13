import {
  GetDeviceSyncStatusMsg,
  SetPauseMsg,
  SyncStatus,
  UpdateDeviceSyncCredentialsMsg,
} from "@keplr-wallet/background";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router";
import style from "./style.module.scss";
import classnames from "classnames";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { AUTH_SERVER } from "../../config.ui.var";

const Divider: FunctionComponent = (props) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <hr
        className="my-0"
        style={{
          flex: 1,
          borderTop: "1px solid #64646D",
        }}
      />
      {props.children ? (
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255)",
            margin: "0 8px",
          }}
        >
          {props.children}
        </div>
      ) : null}
      <hr
        className="my-0"
        style={{
          flex: 1,
          borderTop: "1px solid #64646D",
        }}
      />
    </div>
  );
};

export const SwitchUser: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>();
  const requester = new InExtensionMessageRequester();

  useEffect(() => {
    const getSyncStatus = async () => {
      setSyncStatus(
        await requester.sendMessage(
          BACKGROUND_PORT,
          new GetDeviceSyncStatusMsg()
        )
      );
    };

    getSyncStatus();
  }, []);

  return (
    <div>
      {syncStatus?.email && (
        <div
          style={{
            float: "left",
            paddingTop: "17px",
            paddingRight: "10px",
            fontSize: "13px",
          }}
        >
          <ButtonDropdown
            type="button"
            isOpen={isSelectorOpen}
            toggle={() => setIsSelectorOpen((value) => !value)}
          >
            <DropdownToggle caret className={style["statusContainer"]}>
              <i
                className={classnames(
                  style["status"],
                  syncStatus.tokenExpired || syncStatus.paused
                    ? {}
                    : style["online"],
                  "fa fa-circle"
                )}
                aria-hidden="true"
              />
            </DropdownToggle>
            <DropdownMenu>
              <div
                style={{ fontSize: "small", padding: "10px", cursor: "auto" }}
              >
                {syncStatus.email} <br />
                Last synced 2 minutes ago. <br />
                {syncStatus.paused && "Syncing currently paused."}
                {syncStatus.tokenExpired &&
                  "Your syncing token has expired. Click on reactivate to renew your token"}
              </div>
              <Divider />
              <DropdownItem
                onClick={async (e) => {
                  e.preventDefault();
                  await requester.sendMessage(
                    BACKGROUND_PORT,
                    new SetPauseMsg(!syncStatus.paused)
                  );

                  setSyncStatus({
                    ...syncStatus,
                    paused: !syncStatus.paused,
                  });
                }}
              >
                {syncStatus.paused ? "Resume" : "Pause"}
              </DropdownItem>
              {syncStatus.tokenExpired && (
                <DropdownItem
                  onClick={async (e) => {
                    e.preventDefault();

                    const FAUNA_LOGIN_URL =
                      `${AUTH_SERVER}/login` +
                      `?redirect_uri=${encodeURIComponent(
                        browser.extension.getURL("sync-auth.html")
                      )}` +
                      `&client_id=fetch_wallet` +
                      `&response_type=code`;
                    window.open(FAUNA_LOGIN_URL);
                  }}
                >
                  Reactivate
                </DropdownItem>
              )}
              <DropdownItem
                onClick={async (e) => {
                  e.preventDefault();
                  await requester.sendMessage(
                    BACKGROUND_PORT,
                    new UpdateDeviceSyncCredentialsMsg("")
                  );

                  setSyncStatus({
                    ...syncStatus,
                    email: "",
                  });
                }}
              >
                Opt out
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      )}
      <div
        style={{
          height: "64px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingRight: "20px",
        }}
      >
        <div
          style={{ width: "16px", cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();

            navigate("/setting/set-keyring");
          }}
        >
          <i
            className="fa fa-user"
            aria-hidden="true"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
