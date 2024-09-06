import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/index";
import { SignModal } from "modals/sign";
import { LedgerGranterModal } from "modals/ledger";
import { WCMessageRequester } from "stores/wallet-connect/msg-requester";
import { WCGoBackToBrowserModal } from "modals/wc-go-back-to-browser";
import { AppState, BackHandler, Platform } from "react-native";
import { KeyRingStatus } from "@keplr-wallet/background";
import { NetworkErrorModal } from "modals/network";
import { useNetInfo } from "@react-native-community/netinfo";
import { LoadingScreenModal } from "providers/loading-screen/modal";
import { WalletConnectApprovalModal } from "modals/wallet-connect-approval";

export const InteractionModalsProvider: FunctionComponent = observer(
  ({ children }) => {
    const {
      keyRingStore,
      ledgerInitStore,
      permissionStore,
      signInteractionStore,
      walletConnectStore,
    } = useStore();

    const netInfo = useNetInfo();

    const [openNetworkModel, setIsNetworkModel] = useState(false);

    useEffect(() => {
      const networkIsConnected =
        typeof netInfo.isConnected !== "boolean" || netInfo.isConnected;
      setIsNetworkModel(!networkIsConnected);
    }, [netInfo.isConnected]);

    useEffect(() => {
      if (walletConnectStore.needGoBackToBrowser && Platform.OS === "android") {
        BackHandler.exitApp();
      }
    }, [walletConnectStore.needGoBackToBrowser]);

    useEffect(() => {
      const listener = AppState.addEventListener("change", (e) => {
        if (e === "background" || e === "inactive") {
          walletConnectStore.clearNeedGoBackToBrowser();
        }
      });

      return () => {
        listener.remove();
      };
    }, [walletConnectStore]);

    useEffect(() => {
      for (const data of permissionStore.waitingDatas) {
        // Currently, there is no modal to permit the permission of external apps.
        // All apps should be embedded explicitly.
        // If such apps need the permissions, add these origins to the privileged origins.
        if (
          data.data.origins.length !== 1 ||
          !WCMessageRequester.isVirtualURL(data.data.origins[0])
        ) {
          permissionStore.reject(data.id);
        }
      }
    }, [permissionStore, permissionStore.waitingDatas]);

    return (
      <React.Fragment>
        {/*
         When the wallet connect client from the deep link is creating, show the loading indicator.
         The user should be able to type password to unlock or create the account if there is no account.
         So, we shouldn't show the loading indicator if the keyring is not unlocked.
         */}
        {keyRingStore.status === KeyRingStatus.UNLOCKED && (
          <LoadingScreenModal
            isOpen={
              walletConnectStore.isPendingClientFromDeepLink ||
              walletConnectStore.isPendingWcCallFromDeepLinkClient
            }
          />
        )}
        {walletConnectStore.needGoBackToBrowser && Platform.OS === "ios" ? (
          <WCGoBackToBrowserModal
            isOpen={walletConnectStore.needGoBackToBrowser}
            close={() => {
              walletConnectStore.clearNeedGoBackToBrowser();
            }}
          />
        ) : null}
        {/*unlockInteractionExists ? (
          <UnlockModal
            isOpen={true}
            close={() => {
              // noop
              // Can't close without unlocking.
            }}
          />
        ) : null*/}
        {permissionStore.waitingDatas.map((data) => {
          if (data.data.origins.length === 1) {
            if (
              WCMessageRequester.isVirtualURL(data.data.origins[0]) &&
              walletConnectStore.getSession(
                WCMessageRequester.getIdFromVirtualURL(data.data.origins[0])
              )
            ) {
              return (
                <WalletConnectApprovalModal
                  key={data.id}
                  isOpen={true}
                  close={() => permissionStore.reject(data.id)}
                  id={data.id}
                  data={data.data}
                />
              );
            }
          }

          return null;
        })}
        <SignModal
          isOpen={
            signInteractionStore.waitingData !== undefined &&
            !ledgerInitStore.isInitNeeded
          }
          close={() => {
            signInteractionStore.rejectAll();
          }}
        />
        <LedgerGranterModal
          isOpen={ledgerInitStore.isInitNeeded}
          close={() => ledgerInitStore.abortAll()}
        />
        <NetworkErrorModal
          isOpen={openNetworkModel}
          close={() => {
            setIsNetworkModel(false);
          }}
        />
        {children}
      </React.Fragment>
    );
  }
);
