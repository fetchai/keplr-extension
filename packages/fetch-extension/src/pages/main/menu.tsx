/* eslint-disable import/no-extraneous-dependencies */
import React, { FunctionComponent, useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import styleMenu from "./menu.module.scss";

import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { GetDeviceSyncStatusMsg } from "@keplr-wallet/background";

export const Menu: FunctionComponent = observer(() => {
  const { chainStore, keyRingStore, analyticsStore } = useStore();
  const [showSync, setShowSync] = useState<boolean>(true);

  const navigate = useNavigate();
  useEffect(() => {
    const getSyncStatus = async () => {
      const requester = new InExtensionMessageRequester();

      const syncStatus = await requester.sendMessage(
        BACKGROUND_PORT,
        new GetDeviceSyncStatusMsg()
      );

      setShowSync(
        syncStatus?.email && !syncStatus.syncPasswordNotAvailable ? false : true
      );
    };

    getSyncStatus();
  }, []);

  return (
    <div className={styleMenu["container"]}>
      <div
        className={styleMenu["item"]}
        onClick={() => {
          analyticsStore.logEvent("Address book viewed");
          navigate({
            pathname: "/setting/address-book",
          });
        }}
      >
        <FormattedMessage id="main.menu.address-book" />
      </div>

      <div
        className={styleMenu["item"]}
        onClick={() => {
          navigate({
            pathname: "/setting",
          });
        }}
      >
        <FormattedMessage id="main.menu.settings" />
      </div>
      <a
        className={styleMenu["item"]}
        href="https://docs.fetch.ai/fetch-wallet/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FormattedMessage id="main.menu.guide" />
      </a>
      {showSync && (
        <div
          className={styleMenu["item"]}
          onClick={(e) => {
            e.preventDefault();
            browser.tabs.create({
              url: "/popup.html#/register?sync-page=1",
            });
          }}
        >
          <FormattedMessage id="main.menu.sync" />
        </div>
      )}
      {(chainStore.current.features ?? []).find(
        (feature) =>
          feature === "cosmwasm" ||
          feature === "secretwasm" ||
          feature === "evm"
      ) ? (
        <div
          className={styleMenu["item"]}
          onClick={() => {
            navigate({
              pathname: "/setting/token/add",
            });
          }}
        >
          <FormattedMessage id="setting.token.add" />
        </div>
      ) : null}
      {(chainStore.current.features ?? []).find(
        (feature) =>
          feature === "cosmwasm" ||
          feature === "secretwasm" ||
          feature === "evm"
      ) ? (
        <div
          className={styleMenu["item"]}
          onClick={() => {
            navigate({
              pathname: "/setting/token/manage",
            });
          }}
        >
          <FormattedMessage id="main.menu.token-list" />
        </div>
      ) : null}
      {/* Empty div for separating last item */}
      <div style={{ flex: 1 }} />
      <div
        className={styleMenu["item"]}
        onClick={() => {
          keyRingStore.lock();
          navigate("/");
        }}
      >
        <FormattedMessage id="main.menu.sign-out" />
      </div>
      <div>
        <hr className="mx-4 my-1" />
      </div>
      <div className={styleMenu["footer"]}>
        <a
          className={styleMenu["inner"]}
          href="https://github.com/fetchai/keplr-extension"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github" />
          <FormattedMessage id="main.menu.footer.github" />
        </a>
      </div>
    </div>
  );
});
