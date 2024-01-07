import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import {useStyle} from "styles/index";
import { action, makeObservable, observable } from "mobx";
import {
  IFeeConfig,
  IGasConfig,
  InsufficientFeeError,
  NotLoadedFeeError,
} from "@keplr-wallet/hooks";
import { GasInput } from "../../input/gas";
import {useStore} from "stores/index";
import { CoinPretty, PricePretty } from "@keplr-wallet/unit";
import {LoadingSpinner} from "components/spinner";
import {RectButton} from "components/rect-button";
import { observer } from "mobx-react-lite";
import { BlurButton } from "../button/blur-button";
import { InputCardView } from "../card-view/input-card";

export interface FeeButtonsProps {
  labelStyle?: TextStyle;
  containerStyle?: ViewProps;
  buttonsContainerStyle?: ViewProps;
  errorLabelStyle?: TextStyle;

  label: string;
  gasLabel: string;

  feeConfig: IFeeConfig;
  gasConfig: IGasConfig;
}

class FeeButtonState {
  @observable
  protected _isGasInputOpen: boolean = false;

  constructor() {
    makeObservable(this);
  }

  get isGasInputOpen(): boolean {
    return this._isGasInputOpen;
  }

  @action
  setIsGasInputOpen(open: boolean) {
    this._isGasInputOpen = open;
  }
}

export const FeeButtons: FunctionComponent<FeeButtonsProps> = observer(
  (props) => {
    // This may be not the good way to handle the states across the components.
    // But, rather than using the context API with boilerplate code, just use the mobx state to simplify the logic.
    const [feeButtonState] = useState(() => new FeeButtonState());

    return (
      <React.Fragment>
        {props.feeConfig.feeCurrency ? <FeeButtonsInner {...props} /> : null}
        {feeButtonState.isGasInputOpen || !props.feeConfig.feeCurrency ? (
          <GasInput label={props.gasLabel} gasConfig={props.gasConfig} />
        ) : null}
      </React.Fragment>
    );
  }
);

export const getFeeErrorText = (error: Error): string | undefined => {
  switch (error.constructor) {
    case InsufficientFeeError:
      return "Insufficient available balance for transaction fee";
    case NotLoadedFeeError:
      return undefined;
    default:
      return error.message || "Unknown error";
  }
};

export const FeeButtonsInner: FunctionComponent<FeeButtonsProps> = observer(
  ({ labelStyle, containerStyle, errorLabelStyle, label, feeConfig }) => {
    const { priceStore } = useStore();
    const style = useStyle();
    const [isButtonSelected, setIsButtonSelected] = useState<boolean>(false);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
      if (feeConfig.feeCurrency && !feeConfig.fee) {
        feeConfig.setFeeType("average");
      }
    }, [feeConfig]);

    // For chains without feeCurrencies, Keplr assumes tx doesn’t need to include information about the fee and the fee button does not have to be rendered.
    // The architecture is designed so that fee button is not rendered if the parental component doesn’t have a feeCurrency.
    // However, because there may be situations where the fee buttons is rendered before the chain information is changed,
    // and the fee button is an observer, and the sequence of rendering the observer may not appear stabilized,
    // so only handling the rendering in the parent component may not be sufficient
    // Therefore, this line double checks to ensure that the fee buttons is not rendered if fee currency doesn’t exist.
    // But because this component uses hooks, using a hook in the line below can cause an error.
    // Note that hooks should be used above this line, and only rendering-related logic should exist below this line.
    if (!feeConfig.feeCurrency) {
      return <React.Fragment />;
    }

    const lowFee = feeConfig.getFeeTypePretty("low");
    const lowFeePrice = priceStore.calculatePrice(lowFee);

    const averageFee = feeConfig.getFeeTypePretty("average");
    const averageFeePrice = priceStore.calculatePrice(averageFee);

    const highFee = feeConfig.getFeeTypePretty("high");
    const highFeePrice = priceStore.calculatePrice(highFee);

    let isFeeLoading = false;

    const error = feeConfig.error;
    const errorText: string | undefined = (() => {
      if (error) {
        if (error.constructor === NotLoadedFeeError) {
          isFeeLoading = true;
        }

        return getFeeErrorText(error);
      }
    })();

    const renderButton: (
      label: string,
      price: PricePretty | undefined,
      amount: CoinPretty,
      selected: boolean,
      onPress: () => void
    ) => React.ReactElement = (label, price, amount, selected, onPress) => {
      return (
        <RectButton
          style={
            style.flatten(
              ["flex-row", "items-center", "justify-between", "padding-16"],
              [selected && "background-color-indigo", "border-radius-12"]
            ) as ViewStyle
          }
          onPress={onPress}
        >
          <View style={style.flatten(["flex-row"])}>
            <Text style={style.flatten(["h6", "color-white"])}>{label}</Text>
            <Text
              style={style.flatten(
                ["h6", "color-platinum-100", "text-caption1"],
                [selected && "color-white"]
              )}
            >
              {" ~ 15 min"}
            </Text>
          </View>
          {/* {price ? (
            <Text
              style={
                style.flatten(
                  [
                    "padding-top-2",
                    "h7",
                    "color-gray-300",
                    "dark:color-platinum-400",
                  ],
                  [
                    selected && "color-blue-300",
                    selected && "dark:color-platinum-100",
                  ]
                ) as ViewStyle
              }
            >
              {price.toString()}
            </Text>
          ) : null} */}
          <Text
            style={
              style.flatten([
                "text-center",
                "padding-top-2",
                "text-caption1",
                "color-platinum-100",
              ]) as ViewStyle
            }
          >
            {amount.maxDecimals(6).trim(true).separator("").toString()}
          </Text>
        </RectButton>
      );
    };

    return (
      <View
        style={StyleSheet.flatten([
          style.flatten(["padding-bottom-28"]) as ViewStyle,
          containerStyle,
        ])}
      >
        <Text
          style={StyleSheet.flatten([
            style.flatten([
              "h6",
              "color-platinum-100",
              "margin-bottom-18",
            ]) as ViewStyle,
            labelStyle,
          ])}
        >
          {label}
        </Text>
        <View>
          {renderButton(
            "Low",
            lowFeePrice,
            lowFee,
            feeConfig.feeType === "low",
            () => {
              feeConfig.setFeeType("low");
            }
          )}
          <View
            style={style.flatten(["width-1", "margin-top-10"]) as ViewStyle}
          />
          {renderButton(
            "Average",
            averageFeePrice,
            averageFee,
            feeConfig.feeType === "average",
            () => {
              feeConfig.setFeeType("average");
            }
          )}
          <View
            style={style.flatten(["width-1", "margin-top-10"]) as ViewStyle}
          />
          {renderButton(
            "High",
            highFeePrice,
            highFee,
            feeConfig.feeType === "high",
            () => {
              feeConfig.setFeeType("high");
            }
          )}
        </View>
        <View style={style.flatten(["margin-top-24"]) as ViewStyle}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setIsButtonSelected(!isButtonSelected)}
          >
            <BlurButton
              text="Advanced Settings"
              blurIntensity={isButtonSelected ? 50 : 30}
              borderRadius={32}
              backgroundBlur={true}
              containerStyle={
                style.flatten(
                  ["padding-3", "width-160", "items-center"],
                  [
                    isButtonSelected && "border-width-1",
                    "border-radius-64",
                    "border-color-platinum-100",
                  ]
                ) as ViewStyle
              }
              textStyle={style.flatten(["text-caption1"]) as ViewStyle}
            />
          </TouchableOpacity>
          {isButtonSelected ? (
            <View>
              <View style={style.flatten(["flex-row", "items-center"])}>
                <Text
                  style={StyleSheet.flatten([
                    style.flatten([
                      "h6",
                      "color-platinum-100",
                      "margin-y-24",
                      "margin-right-18",
                    ]) as ViewStyle,
                  ])}
                >
                  {"Auto"}
                </Text>
                <Switch
                  trackColor={{
                    false: "#767577",
                    true: Platform.OS === "ios" ? "#ffffff00" : "#767577",
                  }}
                  thumbColor={isEnabled ? "#5F38FB" : "#D0BCFF"}
                  style={[
                    {
                      borderRadius: 16,
                      borderWidth: 1,
                    },
                    style.flatten(["border-color-pink-light@90%"]),
                  ]}
                  onValueChange={() =>
                    setIsEnabled((previousState) => !previousState)
                  }
                  value={isEnabled}
                  // style={style.flatten([])}
                />
              </View>
              {!isEnabled ? (
                <View
                  style={
                    style.flatten(["flex-row", "justify-between"]) as ViewStyle
                  }
                >
                  <InputCardView
                    label="Gas adjustment"
                    placeholderText="-"
                    containerStyle={
                      style.flatten(["flex-1", "margin-right-16"]) as ViewStyle
                    }
                  />
                  <InputCardView
                    label="Estimated "
                    placeholderText="-"
                    containerStyle={style.flatten(["flex-1"]) as ViewStyle}
                  />
                </View>
              ) : null}
              <View style={style.flatten(["margin-top-16"]) as ViewStyle}>
                <InputCardView label="Gas amount" placeholderText="-" />
              </View>
            </View>
          ) : null}
        </View>
        {isFeeLoading ? (
          <View>
            <View
              style={
                style.flatten([
                  "absolute",
                  "height-16",
                  "justify-center",
                  "margin-top-2",
                  "margin-left-4",
                ]) as ViewStyle
              }
            >
              <LoadingSpinner
                size={14}
                color={style.get("color-loading-spinner").color}
              />
            </View>
          </View>
        ) : null}
        {!isFeeLoading && errorText ? (
          <View>
            <Text
              style={StyleSheet.flatten([
                style.flatten([
                  "absolute",
                  "text-caption1",
                  "color-red-400",
                  "margin-top-2",
                  "margin-left-4",
                ]) as ViewStyle,
                errorLabelStyle,
              ])}
            >
              {errorText}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
);
