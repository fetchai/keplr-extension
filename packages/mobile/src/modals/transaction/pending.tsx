import { CardModal } from "modals/card";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Image, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { registerModal } from "modals/base";
import { IconWithText } from "components/new/icon-with-text/icon-with-text";
import { Button } from "components/button";
import { useSmartNavigation } from "navigation/smart-navigation";
import { useIsFocused } from "@react-navigation/native";
import { TendermintTxTracer } from "@keplr-wallet/cosmos";
import { Buffer } from "buffer";
import { useStore } from "stores/index";
import { TransactionSuccessModal } from "modals/transaction/success";
import { TransactionFailedModal } from "modals/transaction/failed";

export const TransactionPendingModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  txnHash: string;
  chainId: string;
}> = registerModal(
  ({ txnHash, chainId }) => {
    const { chainStore } = useStore();

    const style = useStyle();

    const smartNavigation = useSmartNavigation();
    const isFocused = useIsFocused();
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
    const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

    useEffect(() => {
      const chainInfo = chainStore.getChain(chainId);
      let txTracer: TendermintTxTracer | undefined;

      if (isFocused) {
        txTracer = new TendermintTxTracer(chainInfo.rpc, "/websocket");
        txTracer
          .traceTx(Buffer.from(txnHash, "hex"))
          .then((tx) => {
            if (tx.code == null || tx.code === 0) {
              setIsOpenSuccessModal(true);
            } else {
              setIsOpenErrorModal(true);
            }
          })
          .catch((e) => {
            console.log(`Failed to trace the tx (${txnHash})`, e);
          });
      }

      return () => {
        if (txTracer) {
          txTracer.close();
        }
      };
    }, [chainId, chainStore, isFocused, txnHash, smartNavigation]);

    return (
      <React.Fragment>
        <CardModal
          disableGesture={true}
          cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        >
          <IconWithText
            icon={
              <Image
                source={require("assets/image/icon/ic_txn_pending.png")}
                fadeDuration={0}
              />
            }
            title={"Transaction pending"}
            subtitle={
              "Transaction has been broadcasted to blockchain and pending confirmation"
            }
          >
            <Button
              text="Go to homescreen"
              size="large"
              containerStyle={
                style.flatten([
                  "border-radius-64",
                  "margin-top-16",
                ]) as ViewStyle
              }
              rippleColor="black@50%"
              onPress={() => {
                smartNavigation.navigateSmart("Home", {});
              }}
            />
          </IconWithText>
        </CardModal>
        <TransactionSuccessModal
          isOpen={isOpenSuccessModal}
          close={() => setIsOpenSuccessModal(false)}
          txnHash={txnHash}
          chainId={chainId}
        />
        <TransactionFailedModal
          isOpen={isOpenErrorModal}
          close={() => setIsOpenErrorModal(false)}
          txnHash={txnHash}
          chainId={chainId}
        />
      </React.Fragment>
    );
  },
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
