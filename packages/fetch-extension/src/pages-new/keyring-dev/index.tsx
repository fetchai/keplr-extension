import React, { FunctionComponent } from "react";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

import { useNavigate } from "react-router";

import { store } from "@chatStore/index";
import {
  resetChatList,
  setIsChatSubscriptionActive,
} from "@chatStore/messages-slice";
import { resetProposals } from "@chatStore/proposal-slice";
import { resetUser } from "@chatStore/user-slice";
import { useLoadingIndicator } from "@components/loading-indicator";
import { messageAndGroupListenerUnsubscribe } from "@graphQL/messages-api";
// import { MultiKeyStoreInfoWithSelectedElem } from "@keplr-wallet/background";
import { App, AppCoinType } from "@keplr-wallet/ledger-cosmos";
import { useIntl } from "react-intl";
import { ButtonGradient } from "../../new-components-1/button-gradient";
import { Card } from "../../new-components-1/card";
export const SetKeyRingPage: FunctionComponent = observer(() => {
  const intl = useIntl();

  const { keyRingStore, analyticsStore } = useStore();
  const navigate = useNavigate();
  const loadingIndicator = useLoadingIndicator();
  return (
    <div>
      {keyRingStore.multiKeyStoreInfo.map((keyStore, i) => {
        const bip44HDPath = keyStore.bip44HDPath
          ? keyStore.bip44HDPath
          : {
              account: 0,
              change: 0,
              addressIndex: 0,
            };
        let paragraph = keyStore.meta?.["email"]
          ? keyStore.meta["email"]
          : undefined;
        if (keyStore.type === "keystone") {
          paragraph = "Keystone";
        } else if (keyStore.type === "ledger") {
          const coinType = (() => {
            if (
              keyStore.meta &&
              keyStore.meta["__ledger__cosmos_app_like__"] &&
              keyStore.meta["__ledger__cosmos_app_like__"] !== "Cosmos"
            ) {
              return (
                AppCoinType[
                  keyStore.meta["__ledger__cosmos_app_like__"] as App
                ] || 118
              );
            }

            return 118;
          })();

          paragraph = `Ledger - m/44'/${coinType}'/${bip44HDPath.account}'${
            bip44HDPath.change !== 0 || bip44HDPath.addressIndex !== 0
              ? `/${bip44HDPath.change}/${bip44HDPath.addressIndex}`
              : ""
          }`;

          if (
            keyStore.meta &&
            keyStore.meta["__ledger__cosmos_app_like__"] &&
            keyStore.meta["__ledger__cosmos_app_like__"] !== "Cosmos"
          ) {
            paragraph += ` (${keyStore.meta["__ledger__cosmos_app_like__"]})`;
          }
        }
        console.log(paragraph);
        return (
          <Card
            heading={
              keyStore.meta?.["name"]
                ? keyStore.meta["name"]
                : intl.formatMessage({
                    id: "setting.keyring.unnamed-account",
                  })
            }
            rightContent={
              keyStore.selected
                ? require("@assets/svg/wireframe/check.svg")
                : ""
            }
            // subheading={"subheading"}
            isActive={keyStore.selected}
            onClick={
              keyStore.selected
                ? undefined
                : async (e: any) => {
                    e.preventDefault();
                    loadingIndicator.setIsLoading("keyring", true);
                    try {
                      await keyRingStore.changeKeyRing(i);
                      analyticsStore.logEvent("Account changed");
                      loadingIndicator.setIsLoading("keyring", false);
                      store.dispatch(resetUser({}));
                      store.dispatch(resetProposals({}));
                      store.dispatch(resetChatList({}));
                      store.dispatch(setIsChatSubscriptionActive(false));
                      messageAndGroupListenerUnsubscribe();
                      navigate("/");
                    } catch (e: any) {
                      console.log(`Failed to change keyring: ${e.message}`);
                      loadingIndicator.setIsLoading("keyring", false);
                    }
                  }
            }
          />
        );
      })}

      <ButtonGradient
        text="Add New Wallet"
        gradientText="+"
        onClick={(e: any) => {
          e.preventDefault();
          analyticsStore.logEvent("Add additional account started");

          browser.tabs.create({
            url: "/popup.html#/register",
          });
        }}
      />
    </div>
  );
});
