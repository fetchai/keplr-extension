import React, { FunctionComponent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useSendTxConfig } from "@keplr-wallet/hooks";
import { useStore } from "../../../stores";
import { PageWithScrollView } from "../../../components/page";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { FeeButtons } from "../../../components/new/fee-button/fee-button-component";
import { useStyle } from "../../../styles";
import { Button } from "../../../components/button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSmartNavigation } from "../../../navigation";
import { Buffer } from "buffer/";
import { DropDownCardView } from "../../../components/new/card-view/drop-down-card";
import { ChevronDownIcon } from "../../../components/icon/new/chevron-down";
import Toast from "react-native-toast-message";
import { InputCardView } from "../../../components/new/card-view/input-card";
import { AddressInputCard } from "../../../components/new/card-view/address-card";
import { AmountInputSection } from "../../../components/new/input/amount";

export const NewSendScreen: FunctionComponent = observer(() => {
  const { chainStore, accountStore, queriesStore, analyticsStore } = useStore();

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          chainId?: string;
          currency?: string;
          recipient?: string;
        }
      >,
      string
    >
  >();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const chainId = route.params.chainId
    ? route.params.chainId
    : chainStore.current.chainId;

  const account = accountStore.getAccount(chainId);

  const sendConfigs = useSendTxConfig(
    chainStore,
    queriesStore,
    accountStore,
    chainId,
    account.bech32Address,
    {
      allowHexAddressOnEthermint: true,
    }
  );

  useEffect(() => {
    if (route.params.currency) {
      const currency = sendConfigs.amountConfig.sendableCurrencies.find(
        (cur) => cur.coinMinimalDenom === route.params.currency
      );
      if (currency) {
        sendConfigs.amountConfig.setSendCurrency(currency);
      }
    }
  }, [route.params.currency, sendConfigs.amountConfig]);

  useEffect(() => {
    if (route.params.recipient) {
      sendConfigs.recipientConfig.setRawRecipient(route.params.recipient);
    }
  }, [route.params.recipient, sendConfigs.recipientConfig]);

  const sendConfigError =
    sendConfigs.recipientConfig.error ??
    sendConfigs.amountConfig.error ??
    sendConfigs.memoConfig.error ??
    sendConfigs.gasConfig.error ??
    sendConfigs.feeConfig.error;
  const txStateIsValid = sendConfigError == null;

  return (
    <PageWithScrollView
      backgroundMode="image"
      contentContainerStyle={style.get("flex-grow-1")}
      style={style.flatten(["padding-x-page"]) as ViewStyle}
    >
      <View style={style.flatten(["height-page-pad"]) as ViewStyle} />
      <AmountInputSection amountConfig={sendConfigs.amountConfig} />

      {/* This is a send component */}

      <View style={style.flatten(["margin-y-20"]) as ViewStyle}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            Toast.show({
              type: "error",
              text1: "Fetch.AI is working",
            })
          }
        >
          <DropDownCardView
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
            mainHeading="Wallet"
            heading="Main wallet"
            trailingIcon={<ChevronDownIcon />}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            Toast.show({
              type: "error",
              text1: "Fetch.AI is working",
            })
          }
        >
          <DropDownCardView
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
            mainHeading="Asset"
            heading="FET"
            subHeading="Optional"
            trailingIcon={<ChevronDownIcon />}
          />
        </TouchableOpacity>
        <AddressInputCard
          backgroundContainerStyle={
            style.flatten(["margin-bottom-card-gap"]) as ViewStyle
          }
          label="Recipient"
          placeholderText="Wallet address"
          recipientConfig={sendConfigs.recipientConfig}
          memoConfig={sendConfigs.memoConfig}
        />
        <InputCardView label="Memo" placeholderText="Optional" />
      </View>
      <FeeButtons
        label="Fee"
        gasLabel="gas"
        feeConfig={sendConfigs.feeConfig}
        gasConfig={sendConfigs.gasConfig}
      />
      <View style={style.flatten(["flex-1"])} />
      <Button
        text="Review order"
        size="large"
        containerStyle={
          style.flatten([
            "background-color-white",
            "border-radius-64",
          ]) as ViewStyle
        }
        rippleColor="black@50%"
        textStyle={style.flatten(["color-indigo-900"]) as ViewStyle}
        disabled={!account.isReadyToSendTx || !txStateIsValid}
        loading={account.txTypeInProgress === "send"}
        onPress={async () => {
          if (account.isReadyToSendTx && txStateIsValid) {
            try {
              await account.sendToken(
                sendConfigs.amountConfig.amount,
                sendConfigs.amountConfig.sendCurrency,
                sendConfigs.recipientConfig.recipient,
                sendConfigs.memoConfig.memo,
                sendConfigs.feeConfig.toStdFee(),
                {
                  preferNoSetFee: true,
                  preferNoSetMemo: true,
                },
                {
                  onBroadcasted: (txHash) => {
                    analyticsStore.logEvent("Send token tx broadcasted", {
                      chainId: chainStore.current.chainId,
                      chainName: chainStore.current.chainName,
                      feeType: sendConfigs.feeConfig.feeType,
                    });
                    smartNavigation.pushSmart("TxPendingResult", {
                      txHash: Buffer.from(txHash).toString("hex"),
                    });
                  },
                }
              );
            } catch (e) {
              if (e?.message === "Request rejected") {
                return;
              }
              console.log(e);
              smartNavigation.navigateSmart("Home", {});
            }
          }
        }}
      />
      <View style={style.flatten(["height-page-pad"]) as ViewStyle} />
    </PageWithScrollView>
  );
});
