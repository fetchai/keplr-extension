import React, { FunctionComponent, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";

import { observer } from "mobx-react-lite";
import { IconView } from "components/new/button/icon";
import {
  EmptyAddressError,
  ICNSFailedToFetchError,
  ICNSIsFetchingError,
  IMemoConfig,
  InvalidBech32Error,
  IRecipientConfig,
  IRecipientConfigWithICNS,
  useAddressBookConfig,
} from "@keplr-wallet/hooks";
import { useSmartNavigation } from "../../../navigation";
import { AddressBookCardModel } from "../addressbook-card/addressbook-card";
import { useStore } from "stores/index";
import { AsyncKVStore } from "../../../common";
import { Divider } from "../../divider";
import { QRCodeIcon } from "../icon/qrcode-icon";
import { ATIcon } from "../icon/at-icon";

function numOfCharacter(str: string, c: string): number {
  return str.split(c).length - 1;
}

export const AddressInputCard: FunctionComponent<{
  label?: string;
  backgroundContainerStyle?: ViewStyle;
  placeholderText?: string;
  recipientConfig: IRecipientConfig | IRecipientConfigWithICNS;
  memoConfig?: IMemoConfig;
}> = observer(
  ({
    label,
    backgroundContainerStyle,
    placeholderText,
    recipientConfig,
    memoConfig,
  }) => {
    const style = useStyle();
    const smartNavigation = useSmartNavigation();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { chainStore } = useStore();

    const chainId = chainStore.current.chainId;

    const addressBookConfig = useAddressBookConfig(
      new AsyncKVStore("address_book"),
      chainStore,
      chainId,
      {
        setRecipient: (recipient: string) => {
          if (recipientConfig) {
            recipientConfig.setRawRecipient(recipient);
          }
        },
        setMemo: (memo: string) => {
          if (memoConfig) {
            memoConfig.setMemo(memo);
          }
        },
      }
    );

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

    // const isICNSName: boolean = (() => {
    //   if ("isICNSName" in recipientConfig) {
    //     return recipientConfig.isICNSName;
    //   }
    //   return false;
    // })();

    // const isICNSfetching: boolean = (() => {
    //   if ("isICNSFetching" in recipientConfig) {
    //     return recipientConfig.isICNSFetching;
    //   }
    //   return false;
    // })();

    return (
      <React.Fragment>
        {label ? (
          <Text
            style={
              style.flatten([
                "padding-y-4",
                "margin-y-8",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            {label}
          </Text>
        ) : null}
        <BlurBackground
          borderRadius={12}
          blurIntensity={16}
          containerStyle={
            [
              style.flatten(["padding-x-18", "padding-y-8"]),
              backgroundContainerStyle,
            ] as ViewStyle
          }
        >
          <View style={style.flatten(["flex-row"])}>
            <View style={style.flatten(["flex-3"]) as ViewStyle}>
              <TextInput
                placeholderTextColor={style.flatten(["color-gray-200"]).color}
                style={style.flatten(["h6", "color-white"]) as ViewStyle}
                returnKeyType="done"
                placeholder={placeholderText}
                value={recipientConfig.rawRecipient}
                multiline={true}
                onChangeText={(text) => {
                  if (
                    // If icns is possible and users enters ".", complete bech32 prefix automatically.
                    "isICNSEnabled" in recipientConfig &&
                    recipientConfig.isICNSEnabled &&
                    text.length > 0 &&
                    text[text.length - 1] === "." &&
                    numOfCharacter(text, ".") === 1 &&
                    numOfCharacter(recipientConfig.rawRecipient, ".") === 0
                  ) {
                    text = text + recipientConfig.icnsExpectedBech32Prefix;
                  }
                  recipientConfig.setRawRecipient(text);
                }}
              />
            </View>
            <View
              style={
                style.flatten([
                  "items-end",
                  "justify-center",
                  "margin-left-20",
                ]) as ViewStyle
              }
            >
              <View style={style.flatten(["flex-row"])}>
                <Divider
                  containerStyle={
                    style.flatten([
                      "margin-right-16",
                      "margin-top-10",
                    ]) as ViewStyle
                  }
                />
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    smartNavigation.navigateSmart("Camera", {
                      showMyQRButton: false,
                    });
                  }}
                >
                  <IconView
                    img={<QRCodeIcon />}
                    backgroundBlur={false}
                    iconStyle={
                      style.flatten([
                        "padding-y-12",
                        "padding-right-16",
                      ]) as ViewStyle
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setIsOpenModal(true)}
                >
                  <IconView
                    img={<ATIcon />}
                    backgroundBlur={false}
                    iconStyle={style.flatten(["padding-y-12"]) as ViewStyle}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {errorText ? (
            <View>
              <Text
                style={StyleSheet.flatten([
                  style.flatten([
                    "text-caption2",
                    "color-red-400",
                    "margin-top-2",
                  ]) as ViewStyle,
                ])}
              >
                {errorText}
              </Text>
            </View>
          ) : null}
        </BlurBackground>
        <AddressBookCardModel
          isOpen={isOpenModal}
          title="Address book"
          close={() => setIsOpenModal(false)}
          addressBookConfig={addressBookConfig}
        />
      </React.Fragment>
    );
  }
);
