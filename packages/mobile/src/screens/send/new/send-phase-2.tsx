import React, { FunctionComponent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  AmountConfig,
  FeeConfig,
  MemoConfig,
  RecipientConfig,
  SendGasConfig,
} from "@keplr-wallet/hooks";
import { useStore } from "stores/index";
import { PageWithScrollView } from "components/page";
import { Text, View, ViewStyle } from "react-native";
import { FeeButtons } from "components/new/fee-button/fee-button-component";
import { useStyle } from "styles/index";
import { Button } from "components/button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Buffer } from "buffer/";
import { AddressInputCard } from "components/new/card-view/address-card";
import { BlurButton } from "components/new/button/blur-button";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import { MemoInputView } from "components/new/card-view/memo-input";
import { useSmartNavigation } from "navigation/smart-navigation";

interface SendConfigs {
  amountConfig: AmountConfig;
  memoConfig: MemoConfig;
  gasConfig: SendGasConfig;
  feeConfig: FeeConfig;
  recipientConfig: RecipientConfig;
}

export const SendPhase2: FunctionComponent<{
  sendConfigs: SendConfigs;
  setIsNext: any;
}> = observer(({ sendConfigs, setIsNext }) => {
  const { chainStore, accountStore, analyticsStore, priceStore } = useStore();

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

  const convertToUsd = (currency: any) => {
    const value = priceStore.calculatePrice(currency);
    const inUsd = value && value.shrink(true).maxDecimals(6).toString();
    return inUsd;
  };

  const usdValue = () =>
    convertToUsd(
      sendConfigs.amountConfig
        ? new CoinPretty(
            sendConfigs.amountConfig.sendCurrency,
            new Int(sendConfigs.amountConfig.amount * 10 ** decimals)
          )
        : new CoinPretty(sendConfigs.amountConfig.sendCurrency, new Int(0))
    );

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

  const decimals = sendConfigs.amountConfig.sendCurrency.coinDecimals;

  return (
    <React.Fragment>
      <PageWithScrollView
        backgroundMode="image"
        contentContainerStyle={style.get("flex-grow-1")}
        style={style.flatten(["padding-x-page"]) as ViewStyle}
      >
        <View style={style.flatten(["height-page-pad"]) as ViewStyle} />
        <View
          style={
            style.flatten([
              "flex-row",
              "border-width-1",
              "border-color-gray-400",
              "border-radius-12",
              "padding-x-20",
              "padding-y-12",
            ]) as ViewStyle
          }
        >
          <View
            style={style.flatten(["flex-3", "justify-center"]) as ViewStyle}
          >
            {usdValue() ? (
              <Text style={style.flatten(["color-white", "h6"]) as ViewStyle}>
                {usdValue()} {`${priceStore.defaultVsCurrency.toUpperCase()}`}
              </Text>
            ) : null}
            <Text
              style={
                style.flatten([
                  "color-gray-300",
                  "text-caption1",
                  "font-bold",
                  "margin-top-2",
                ]) as ViewStyle
              }
            >
              {parseFloat(sendConfigs.amountConfig.amount)
                .toFixed(6)
                .toString()}{" "}
              {sendConfigs.amountConfig.sendCurrency.coinDenom}
            </Text>
          </View>
          <BlurButton
            text={"Edit"}
            borderRadius={32}
            backgroundBlur={false}
            containerStyle={
              style.flatten([
                "border-width-1",
                "border-color-gray-300",
              ]) as ViewStyle
            }
            textStyle={
              style.flatten(["padding-x-18", "padding-y-2"]) as ViewStyle
            }
            onPress={() => setIsNext(false)}
          />
        </View>

        <View style={style.flatten(["margin-y-20"]) as ViewStyle}>
          <AddressInputCard
            backgroundContainerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
            label="Recipient"
            placeholderText="Wallet address"
            recipientConfig={sendConfigs.recipientConfig}
            memoConfig={sendConfigs.memoConfig}
          />
          <MemoInputView
            label="Memo"
            placeholderText="Optional"
            memoConfig={sendConfigs.memoConfig}
          />
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
              "margin-top-24",
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
    </React.Fragment>
  );
});
