import React, { FunctionComponent, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import moment from "moment";
import { getActivityIcon, getDetails } from "utils/stable-sort";
import { useStore } from "stores/index";
import { useStyle } from "styles/index";
import { IconButton } from "components/new/button/icon";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

export const ActivityRow: FunctionComponent<{
  node: any;
  setDate: any;
}> = ({ node, setDate }) => {
  const style = useStyle();
  const { chainStore } = useStore();
  const [isAmountDeducted, setIsAmountDeducted] = useState(false);

  useEffect(() => {
    setIsAmountDeducted(isAmountDeducted);
  }, [isAmountDeducted]);

  useEffect(() => {
    const details = getDetails(node, chainStore);
    const currentDate = moment(details.timestamp)
      .utc()
      .format("MMMM DD, hh:mm A");
    setDate(currentDate);
  }, [node, setDate]);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const details = getDetails(node, chainStore);

  return (
    <TouchableOpacity
      style={style.flatten(["flex-row", "items-center"]) as ViewStyle}
      onPress={() =>
        navigation.navigate("Others", {
          screen: "ActivityDetails",
          params: {
            details: details,
          },
        })
      }
    >
      <View
        style={
          style.flatten([
            "flex-row",
            "margin-left-16",
            "margin-right-8",
          ]) as ViewStyle
        }
      >
        <IconButton
          icon={getActivityIcon(details.verb)}
          backgroundBlur={true}
          iconStyle={
            style.flatten([
              "width-32",
              "height-32",
              "items-center",
              "justify-center",
            ]) as ViewStyle
          }
        />
      </View>
      <View style={style.flatten(["flex-1"]) as ViewStyle}>
        <Text
          style={
            style.flatten([
              "h7",
              "padding-4",
              "color-white",
              "font-medium",
            ]) as ViewStyle
          }
        >
          {details.verb}
        </Text>
        <Text
          style={
            style.flatten([
              "h7",
              "padding-2",
              "color-gray-300",
              "font-medium",
            ]) as ViewStyle
          }
        >
          {node.transaction.status === "Success" ? (
            <React.Fragment>
              Confirmed • {moment(details.timestamp).format("hh:mm A")}
            </React.Fragment>
          ) : (
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              Error
            </Text>
          )}
        </Text>
      </View>

      <View style={style.flatten(["flex-row", "margin-right-16"]) as ViewStyle}>
        <Text
          style={
            style.flatten([
              "h7",
              details.verb == "Received" ? "color-green-400" : "color-white",
            ]) as ViewStyle
          }
        >
          {details.amountNumber}
        </Text>
        <Text
          style={
            style.flatten([
              "h7",
              "color-gray-300",
              "margin-left-4",
            ]) as ViewStyle
          }
        >
          {details.amountAlphabetic}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
