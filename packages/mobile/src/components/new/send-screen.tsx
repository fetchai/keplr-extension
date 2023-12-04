import React, { FunctionComponent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useSendTxConfig } from "@keplr-wallet/hooks";
import { useStore } from "../../stores";
import { PageWithScrollView } from "../page";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
// import {
//   AddressInput,
//   AmountInput,
//   MemoInput,
//   CurrencySelector,
//   // FeeButtons,
// } from "../input";
import { FeeButtons } from "./fee-button/fee-button-component";
import { useStyle } from "../../styles";
import { Button } from "../button";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSmartNavigation } from "../../navigation";
import { Buffer } from "buffer/";
import { DropDownCardView } from "./card-view/drop-down-card";
import { ChevronDownIcon } from "../icon/new/chevron-down";
import { SimpleCardView } from "./card-view/simple-card";
import { QRCodeIcon } from "../icon/new/qrcode-icon";
import { IconView } from "./button/icon";
import { ATIcon } from "../icon/new/at-icon";
import Toast from "react-native-toast-message";
import { ReloadIcon } from "../icon/new/reload-icon";
import { BlurButton } from "./button/blur-button";

export const SendScreen: FunctionComponent = observer(() => {
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
      {/* <AddressInput
        label="Recipient"
        recipientConfig={sendConfigs.recipientConfig}
        memoConfig={sendConfigs.memoConfig}
      />
      <CurrencySelector
        label="Token"
        placeHolder="Select Token"
        amountConfig={sendConfigs.amountConfig}
      />
      <AmountInput label="Amount" amountConfig={sendConfigs.amountConfig} />
      <MemoInput label="Memo (Optional)" memoConfig={sendConfigs.memoConfig} /> */}

      {/* This is a amount component */}
      <View
        style={
          style.flatten([
            "flex-row",
            "padding-y-12",
            "items-center",
          ]) as ViewStyle
        }
      >
        <View style={style.flatten(["flex-3"]) as ViewStyle}>
          <Text style={style.flatten(["h6", "color-white"]) as ViewStyle}>
            {"Amount"}
          </Text>
          <View style={style.flatten(["flex-row", "items-end"])}>
            <Text
              style={
                style.flatten(["h1", "color-white", "font-medium"]) as ViewStyle
              }
            >
              {"13,424.21"}
            </Text>
            <Text
              style={
                style.flatten([
                  "h5",
                  "color-white",
                  "font-medium",
                  "padding-bottom-10",
                ]) as ViewStyle
              }
            >
              {"FET"}
            </Text>
          </View>
          <Text
            style={
              style.flatten(["text-caption1", "color-gray-100"]) as ViewStyle
            }
          >
            {"$0.00 USD"}
          </Text>
        </View>
        <View style={style.flatten(["items-end"]) as ViewStyle}>
          <View style={style.flatten(["flex-row"])}>
            <IconView
              img={<ReloadIcon size={21} />}
              backgroundBlur={true}
              iconStyle={
                style.flatten([
                  "padding-8",
                  "margin-left-18",
                  "margin-right-12",
                ]) as ViewStyle
              }
            />
            <BlurButton
              text="Max"
              borderRadius={32}
              backgroundBlur={true}
              containerStyle={
                style.flatten(["justify-center", "padding-x-10"]) as ViewStyle
              }
              textStyle={style.flatten(["text-button2"]) as ViewStyle}
            />
          </View>
        </View>
      </View>

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
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            Toast.show({
              type: "error",
              text1: "Fetch.AI is working",
            })
          }
        >
          <SimpleCardView
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
            mainHeading="Wallet"
            heading="fetch1pneh5rcwhtfk3zttq3ntuwzejaucmzzdpeqe8z"
            trailingIconComponent={
              <View style={style.flatten(["flex-row"])}>
                <IconView
                  img={<QRCodeIcon />}
                  backgroundBlur={true}
                  iconStyle={
                    style.flatten([
                      "padding-11",
                      "margin-left-18",
                      "margin-right-12",
                    ]) as ViewStyle
                  }
                />
                <IconView
                  img={<ATIcon />}
                  backgroundBlur={true}
                  iconStyle={style.flatten(["padding-11"]) as ViewStyle}
                />
              </View>
            }
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
          <SimpleCardView
            containerStyle={
              style.flatten(["margin-bottom-card-gap"]) as ViewStyle
            }
            mainHeading="Memo"
            subHeading="Optional"
          />
        </TouchableOpacity>
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
