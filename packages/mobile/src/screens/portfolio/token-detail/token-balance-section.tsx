import React, { FunctionComponent, useState } from "react";
import { observer } from "mobx-react-lite";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Button } from "components/button";
import { ArrowDownGradientIcon } from "components/new/icon/arrow-down-gradient";
import { ArrowUpGradientIcon } from "components/new/icon/arrow-up-gradient";
import { useStyle } from "styles/index";
import { useStore } from "stores/index";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { EarnIcon } from "components/new/icon/earn-icon";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { LockIcon } from "components/new/icon/lock";
import { ChevronDownIcon } from "components/new/icon/chevron-down";
import { ChevronUpIcon } from "components/new/icon/chevron-up";
import { ExternalLinkIcon } from "components/new/icon/external-link";
import { SlideDownAnimation } from "components/new/animations/slide-down";

export const TokenBalanceSection: FunctionComponent<{
  totalNumber: string;
  totalDenom: string;
  totalPrice: string;
}> = observer(({ totalNumber, totalDenom, totalPrice }) => {
  const style = useStyle();
  const { accountStore, chainStore, priceStore, analyticsStore, queriesStore } =
    useStore();
  const chainId = chainStore.current.chainId;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const queries = queriesStore.get(chainId);
  const accountInfo = accountStore.getAccount(chainId);

  const isVesting = queries.cosmos.queryAccount.getQueryBech32Address(
    accountInfo.bech32Address
  ).isVestingAccount;

  const [showRewars, setShowRewards] = useState(false);

  return (
    <View style={style.flatten(["flex-column", "margin-x-page"]) as ViewStyle}>
      <View style={style.flatten(["margin-bottom-24"]) as ViewStyle}>
        <Text
          style={
            style.flatten([
              "color-white@60%",
              "text-caption2",
              "font-medium",
            ]) as ViewStyle
          }
        >
          {"YOUR BALANCE"}
        </Text>
        <View style={style.flatten(["flex-row", "margin-top-6"]) as ViewStyle}>
          <Text
            style={
              style.flatten([
                "color-white",
                "h2",
                "font-normal",
                "items-center",
              ]) as ViewStyle
            }
          >
            {totalNumber}
          </Text>
          <Text
            style={
              style.flatten([
                "color-gray-400",
                "h2",
                "font-normal",
                "margin-left-8",
              ]) as ViewStyle
            }
          >
            {totalDenom}
          </Text>
        </View>
        {totalPrice ? (
          <View
            style={
              style.flatten([
                "flex-row",
                "items-center",
                "margin-top-6",
              ]) as ViewStyle
            }
          >
            <Text
              style={style.flatten(["color-gray-300", "body2"]) as ViewStyle}
            >
              {totalPrice}
            </Text>
            <Text
              style={
                style.flatten([
                  "color-gray-300",
                  "body2",
                  "margin-left-6",
                ]) as ViewStyle
              }
            >
              {priceStore.defaultVsCurrency.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>
      {/* banner */}

      {isVesting && (
        <BlurBackground
          borderRadius={12}
          blurIntensity={16}
          containerStyle={
            style.flatten(["padding-18", "margin-bottom-24"]) as ViewStyle
          }
        >
          <View style={style.flatten(["flex-row"]) as ViewStyle}>
            <View style={[style.flatten(["margin-right-12"])] as ViewStyle}>
              <LockIcon size={13} />
            </View>
            <View style={style.flatten(["flex-1"]) as ViewStyle}>
              <Text
                style={style.flatten(["body2", "color-white"]) as ViewStyle}
              >
                Your balance includes 1,489.00 FET that are still vested.
              </Text>
              <View
                style={
                  style.flatten(["margin-top-12", "flex-row"]) as ViewStyle
                }
              >
                <TouchableOpacity
                  onPress={() => setShowRewards(!showRewars)}
                  style={
                    style.flatten(["flex-row", "items-center"]) as ViewStyle
                  }
                >
                  <Text
                    style={
                      [
                        style.flatten(["color-indigo-250", "text-caption2"]),
                        { lineHeight: 15 },
                      ] as ViewStyle
                    }
                  >
                    {!showRewars ? "View calendar" : "Hide calendar"}
                  </Text>
                  <View style={style.flatten(["margin-left-6"]) as ViewStyle}>
                    {!showRewars ? (
                      <ChevronDownIcon color="#BFAFFD" size={12} />
                    ) : (
                      <ChevronUpIcon color="#BFAFFD" size={12} />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={}
                  style={
                    style.flatten([
                      "flex-row",
                      "items-center",
                      "margin-left-12",
                    ]) as ViewStyle
                  }
                >
                  <Text
                    style={
                      [
                        style.flatten(["color-indigo-250", "text-caption2"]),
                        { lineHeight: 15 },
                      ] as ViewStyle
                    }
                  >
                    Learn more
                  </Text>
                  <View style={style.flatten(["margin-left-6"]) as ViewStyle}>
                    <ExternalLinkIcon color="#BFAFFD" size={12} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {showRewars && (
            <View style={style.flatten(["margin-top-16"]) as ViewStyle}>
              <SlideDownAnimation>
                <View
                  style={
                    style.flatten([
                      "flex-row",
                      "items-center",
                      "margin-y-16",
                    ]) as ViewStyle
                  }
                >
                  <View style={style.flatten(["flex-3"]) as ViewStyle}>
                    <Text
                      style={
                        style.flatten([
                          "color-white@60%",
                          "body3",
                          "margin-bottom-6",
                        ]) as ViewStyle
                      }
                    >
                      Round 10/12
                    </Text>
                    <Text
                      style={
                        style.flatten(["color-white", "body3"]) as ViewStyle
                      }
                    >
                      10 Oct 2024
                    </Text>
                  </View>
                  <View
                    style={
                      style.flatten([
                        "flex-1",
                        "flex-row",
                        "justify-end",
                      ]) as ViewStyle
                    }
                  >
                    <Text
                      style={
                        style.flatten(["color-white", "body3"]) as ViewStyle
                      }
                    >
                      496.33
                    </Text>
                    <Text
                      style={
                        style.flatten([
                          "color-white@60%",
                          "body3",
                          "margin-left-4",
                        ]) as ViewStyle
                      }
                    >
                      FET
                    </Text>
                  </View>
                </View>
              </SlideDownAnimation>
            </View>
          )}
        </BlurBackground>
      )}

      {/*Buttons*/}
      <View
        style={
          style.flatten([
            "flex-row",
            "justify-evenly",
            "margin-bottom-12",
          ]) as ViewStyle
        }
      >
        <View style={style.flatten(["flex-1"]) as ViewStyle}>
          <Button
            text={"Receive"}
            rightIcon={<ArrowDownGradientIcon size={15} />}
            textStyle={
              style.flatten([
                "color-indigo-900",
                "margin-right-8",
                "body2",
              ]) as ViewStyle
            }
            containerStyle={
              style.flatten([
                "background-color-white",
                "border-radius-32",
                "margin-right-6",
              ]) as ViewStyle
            }
            onPress={() => {
              analyticsStore.logEvent("receive_click", {
                pageName: "Token Detail",
              });
              navigation.navigate("Others", {
                screen: "Receive",
                params: { chainId: chainId },
              });
            }}
          />
        </View>
        <View style={style.flatten(["flex-1"]) as ViewStyle}>
          <Button
            text={"Send"}
            rightIcon={<ArrowUpGradientIcon size={15} />}
            textStyle={
              style.flatten([
                "color-indigo-900",
                "margin-right-8",
                "body2",
              ]) as ViewStyle
            }
            containerStyle={
              style.flatten([
                "background-color-white",
                "border-radius-32",
                "margin-left-6",
              ]) as ViewStyle
            }
            onPress={() => {
              analyticsStore.logEvent("send_click", {
                pageName: "Token Detail",
              });
              navigation.navigate("Others", {
                screen: "Send",
                params: {
                  currency: chainStore.current.stakeCurrency.coinMinimalDenom,
                },
              });
            }}
          />
        </View>
      </View>
      <Button
        text={"Stake"}
        textStyle={
          style.flatten([
            "color-indigo-900",
            "margin-x-8",
            "body2",
          ]) as ViewStyle
        }
        rightIcon={<EarnIcon size={15} />}
        containerStyle={
          style.flatten([
            "background-color-white",
            "border-radius-32",
            "margin-bottom-16",
          ]) as ViewStyle
        }
        onPress={() => {
          analyticsStore.logEvent("stake_click", {
            chainId: chainStore.current.chainId,
            chainName: chainStore.current.chainName,
            pageName: "Token Detail",
          });
          navigation.navigate("Stake", {
            screen: "Staking.Dashboard",
            params: { isTab: false },
          });
        }}
      />
    </View>
  );
});
