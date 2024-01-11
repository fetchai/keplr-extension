import React, { FunctionComponent } from "react";
import { Text, View, ViewStyle } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {BlurBackground} from "components/new/blur-background/blur-background";
import {useStyle} from "styles/index";
import {CardDivider} from "components/card";

export const StakingCard: FunctionComponent<{ cardStyle?: ViewStyle }> = ({
  cardStyle,
}) => {
  const style = useStyle();
  const pieData = [
    {
      value: 67,
      color: "#F9774B",
      focused: true,
    },
    {
      value: 28,
      color: "#5F38FB",
    },
    { value: 8, color: "#CFC3FE" },
  ];

  const renderLine = (color: string) => {
    return (
      <CardDivider
        vertical={true}
        style={
          [
            style.flatten(["width-4", "border-radius-4"]),
            { backgroundColor: color },
          ] as ViewStyle
        }
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#F9774B")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Available
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {"8,994.22 FET (67%)"}
            </Text>
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#5F38FB")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Staked
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {"8,994.22 FET (28%)"}
            </Text>
          </View>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-10"]) as ViewStyle}>
          {renderLine("#CFC3FE")}
          <View style={style.flatten(["padding-x-10"]) as ViewStyle}>
            <Text style={style.flatten(["color-gray-200", "h7"]) as ViewStyle}>
              Staking rewards
            </Text>
            <Text style={style.flatten(["color-white", "h7"]) as ViewStyle}>
              {"8,994.22 FET (5%)"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BlurBackground
      blurIntensity={10}
      containerStyle={
        [
          style.flatten(["padding-18", "border-radius-16"]),
          cardStyle,
        ] as ViewStyle
      }
    >
      <Text
        style={
          style.flatten(["color-white", "h6", "margin-bottom-20"]) as ViewStyle
        }
      >
        STAKING
      </Text>
      <View
        style={
          style.flatten([
            "flex-row",
            // "justify-between",
            "items-center",
          ]) as ViewStyle
        }
      >
        {renderLegendComponent()}
        <View>
          <PieChart
            data={pieData}
            donut
            sectionAutoFocus
            radius={65}
            innerRadius={40}
            innerCircleColor={"#232B5D"}
            focusOnPress={true}
          />
        </View>
      </View>
    </BlurBackground>
  );
};
