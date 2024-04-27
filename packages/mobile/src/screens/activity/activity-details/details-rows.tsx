import React from "react";
import { View, ViewStyle } from "react-native";
import { formatActivityHash } from "utils/format/format";
import { StakeIcon } from "components/new/icon/stake-icon";
import { ArrowUpIcon } from "components/new/icon/arrow-up";
import { Button } from "components/button";
import { useStyle } from "styles/index";
import { CardDivider } from "components/card";
import { DetailRow } from "screens/activity/activity-details/activity-row";
import Toast from "react-native-toast-message";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

export const DetailRows = ({ details }: { details: any }) => {
  const style = useStyle();
  const fees = JSON.parse(details.fees);
  const mintscanURL = `https://www.mintscan.io/fetchai/tx/${details.hash}/`;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleSendClicked = () => {
    Toast.show({
      type: "error",
      text1: "Coming soon",
      visibilityTime: 3000,
    });
  };

  const openURL = (mintscanURL: string) => {
    navigation.navigate("Others", {
      screen: "WebView",
      params: {
        title: "Activity",
        url: mintscanURL,
      },
    });
  };

  return (
    <React.Fragment>
      <DetailRow
        label="Transaction hash"
        value={formatActivityHash(details.hash)}
      />
      <CardDivider
        style={
          style.flatten([
            "background-color-gray-200@40%",
            "height-1",
            "margin-x-16",
          ]) as ViewStyle
        }
      />
      <DetailRow label="Chain ID" value="fetchhub-4" />
      <CardDivider
        style={
          style.flatten([
            "background-color-gray-200@40%",
            "height-1",
            "margin-x-16",
          ]) as ViewStyle
        }
      />
      {details.verb !== "Received" &&
        details.verb !== "Unstaked" &&
        details.verb !== "Smart Contract Interaction" && (
          <React.Fragment>
            <DetailRow
              label="Gas used/wanted"
              value={details.gasUsed ? details.gasUsed : "-"}
            />
            <CardDivider
              style={
                style.flatten([
                  "background-color-gray-200@40%",
                  "height-1",
                  "margin-x-16",
                ]) as ViewStyle
              }
            />
            <DetailRow
              label="Fees"
              value={`${fees[0].amount} ${fees[0].denom}`}
            />
            <CardDivider
              style={
                style.flatten([
                  "background-color-gray-200@40%",
                  "height-1",
                  "margin-x-16",
                ]) as ViewStyle
              }
            />
            <DetailRow
              label="Memo"
              value={details.memo == "" ? "-" : details.memo}
            />
            <CardDivider
              style={
                style.flatten([
                  "background-color-gray-200@40%",
                  "height-1",
                  "margin-x-16",
                ]) as ViewStyle
              }
            />
          </React.Fragment>
        )}
      <DetailRow
        label="Total amount"
        value={`${details.amountNumber} ${details.amountAlphabetic}`}
      />
      <CardDivider
        style={
          style.flatten([
            "background-color-gray-200@40%",
            "height-1",
            "margin-x-16",
          ]) as ViewStyle
        }
      />
      <View style={style.flatten(["padding-16"]) as ViewStyle}>
        {details.verb == "Staked" || details.verb == "Sent" ? (
          <View
            style={
              style.flatten([
                "flex-row",
                "items-center",
                "justify-between",
                "margin-top-16",
              ]) as ViewStyle
            }
          >
            {details.verb == "Staked" && (
              <React.Fragment>
                <Button
                  text="Stake again"
                  size="default"
                  leftIcon={<StakeIcon size={16} />}
                  textStyle={
                    style.flatten([
                      "color-white",
                      "margin-x-8",
                      "h7",
                    ]) as ViewStyle
                  }
                  containerStyle={
                    style.flatten([
                      "border-radius-32",
                      "width-half",
                      "margin-right-6",
                      "background-color-transparent",
                      "border-width-1",
                      "border-color-platinum-400",
                    ]) as ViewStyle
                  }
                  onPress={() => {
                    handleSendClicked();
                  }}
                />
              </React.Fragment>
            )}
            {details.verb == "Sent" && (
              <React.Fragment>
                <Button
                  text="Send again"
                  size="default"
                  leftIcon={<ArrowUpIcon size={13} />}
                  textStyle={
                    style.flatten([
                      "color-white",
                      "margin-x-8",
                      "h7",
                    ]) as ViewStyle
                  }
                  containerStyle={
                    style.flatten([
                      "border-radius-32",
                      "width-half",
                      "margin-right-6",
                      "background-color-transparent",
                      "border-width-1",
                      "border-color-platinum-400",
                    ]) as ViewStyle
                  }
                  onPress={() => {
                    handleSendClicked();
                  }}
                />
              </React.Fragment>
            )}
            {details.verb == "Sent" && (
              <Button
                text="View on Mintscan"
                size="default"
                textStyle={
                  style.flatten([
                    "color-white",
                    "margin-x-8",
                    "h7",
                  ]) as ViewStyle
                }
                containerStyle={
                  style.flatten([
                    "border-radius-32",
                    "width-half",
                    "margin-right-6",
                    "background-color-transparent",
                    "border-width-1",
                    "border-color-platinum-400",
                  ]) as ViewStyle
                }
                onPress={() => openURL(mintscanURL)}
              />
            )}
          </View>
        ) : (
          <Button
            text="View on Mintscan"
            size="default"
            textStyle={
              style.flatten(["h7", "color-white", "items-center"]) as ViewStyle
            }
            containerStyle={
              style.flatten([
                "border-radius-64",
                "border-color-gray-400",
                "margin-top-24",
                "width-full",
                "height-50",
                "background-color-transparent",
                "border-width-1",
                "border-color-platinum-400",
              ]) as ViewStyle
            }
            onPress={() => openURL(mintscanURL)}
          />
        )}
      </View>
    </React.Fragment>
  );
};
