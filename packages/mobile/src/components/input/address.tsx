import React, { FunctionComponent, useMemo } from "react";
import { observer } from "mobx-react-lite";
import {
  EmptyAddressError,
  ICNSFailedToFetchError,
  ICNSIsFetchingError,
  IMemoConfig,
  InvalidBech32Error,
  IRecipientConfig,
  IRecipientConfigWithICNS,
} from "@keplr-wallet/hooks";
import { TextStyle, View, ViewStyle } from "react-native";
import { TextInput } from "./input";
import { LoadingSpinner } from "../spinner";
import { useStyle } from "../../styles";
import { AddressBookIcon } from "../icon";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSmartNavigation } from "../../navigation";

export const AddressInput: FunctionComponent<
  {
    labelStyle?: TextStyle;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    errorLabelStyle?: TextStyle;

    label: string;

    recipientConfig: IRecipientConfig | IRecipientConfigWithICNS;
  } & (
    | {
        memoConfig?: IMemoConfig;
        disableAddressBook: true;
      }
    | {
        memoConfig: IMemoConfig;
        disableAddressBook?: false;
      }
  )
> = observer(
  ({
    labelStyle,
    containerStyle,
    inputContainerStyle,
    errorLabelStyle,
    label,
    recipientConfig,
    memoConfig,
    disableAddressBook,
  }) => {
    const smartNavigation = useSmartNavigation();

    const style = useStyle();

    const error = recipientConfig.error;
    const errorText: string | undefined = useMemo(() => {
      if (error) {
        switch (error.constructor) {
          case EmptyAddressError:
            // No need to show the error to user.
            return;
          case InvalidBech32Error:
            return "Invalid address";
          case ICNSFailedToFetchError:
            return "Failed to fetch the address from ICNS";
          case ICNSIsFetchingError:
            return;
          default:
            return "Unknown error";
        }
      }
    }, [error]);

    const isICNS: boolean = (() => {
      if ("isICNS" in recipientConfig) {
        return recipientConfig.isICNS;
      }
      return false;
    })();

    const isICNSfetching: boolean = (() => {
      if ("isICNSFetching" in recipientConfig) {
        return recipientConfig.isICNSFetching;
      }
      return false;
    })();

    return (
      <TextInput
        label={label}
        labelStyle={labelStyle}
        containerStyle={containerStyle}
        inputContainerStyle={inputContainerStyle}
        errorLabelStyle={errorLabelStyle}
        error={errorText}
        value={recipientConfig.rawRecipient}
        onChangeText={(text) => {
          recipientConfig.setRawRecipient(text);
        }}
        paragraph={
          isICNS ? (
            isICNSfetching ? (
              <View>
                <View
                  style={style.flatten([
                    "absolute",
                    "height-16",
                    "justify-center",
                    "margin-top-2",
                    "margin-left-4",
                  ])}
                >
                  <LoadingSpinner
                    size={14}
                    color={
                      style.flatten(["color-blue-400", "dark:color-blue-300"])
                        .color
                    }
                  />
                </View>
              </View>
            ) : (
              recipientConfig.recipient
            )
          ) : undefined
        }
        inputRight={
          disableAddressBook ? null : (
            <View
              style={style.flatten([
                "height-1",
                "overflow-visible",
                "justify-center",
              ])}
            >
              <TouchableOpacity
                style={style.flatten(["padding-4"])}
                onPress={() => {
                  smartNavigation.navigateSmart("AddressBook", {
                    recipientConfig,
                    memoConfig,
                  });
                }}
              >
                <AddressBookIcon
                  color={
                    style.flatten(["color-blue-400", "dark:color-blue-100"])
                      .color
                  }
                  height={18}
                />
              </TouchableOpacity>
            </View>
          )
        }
        autoCorrect={false}
        autoCapitalize="none"
        autoCompleteType="off"
      />
    );
  }
);
