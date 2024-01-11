import React, { FunctionComponent } from "react";
import { Dimensions, Text, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import { useStyle } from "styles/index";

export const GraphChart: FunctionComponent<{
  data: any;
}> = ({ data }) => {
  const style = useStyle();

  const maxValue = Number(
    (
      Math.ceil(
        Number(Math.max(...data.map((v: { value: any }) => v.value))) * 10
      ) / 10
    ).toFixed(1)
  );

  const minValue = Number(
    Math.floor(
      Number(Math.min(...data.map((v: { value: any }) => v.value))) * 10
    ) / 10
  );

  const chartMaxValue = Number((maxValue - minValue).toFixed(1));

  const spacingDataPoint = data.length
    ? Number(((Dimensions.get("window").width - 27) / data.length).toFixed(2))
    : 1;

  const noOfSection = Number((maxValue - minValue).toFixed(1)) * 10;

  return (
    <LineChart
      // chart variable
      areaChart={true}
      areaGradientComponent={() => {
        return (
          <LinearGradient id="Gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={"#F9774B"} stopOpacity={"0.3"} />
            <Stop offset="0.5" stopColor={"#CF447B"} stopOpacity={"0.1"} />
            <Stop offset="1" stopColor={"#5F38FB"} stopOpacity={"0"} />
          </LinearGradient>
        );
      }}
      data={data}
      curved={true}
      width={Dimensions.get("window").width - 25}
      //   animation variable
      isAnimated={true}
      animationDuration={1200}
      animateOnDataChange={true}
      onDataChangeAnimationDuration={300}
      // data points variable
      hideDataPoints={true}
      spacing={spacingDataPoint}
      thickness={2}
      initialSpacing={4}
      endSpacing={0}
      // y label variable
      showFractionalValues={true}
      maxValue={chartMaxValue}
      noOfSections={noOfSection}
      yAxisOffset={minValue}
      // y axis variable
      yAxisThickness={0}
      yAxisColor={"lightgray"}
      hideYAxisText={true}
      xAxisThickness={0}
      // horizontal line vriable
      hideRules={true}
      // line variable
      lineGradient={true}
      lineGradientId="lineGradient"
      lineGradientComponent={() => {
        return (
          <LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={"#5F38FB"} />
            <Stop offset="0.5" stopColor={"#CF447B"} />
            <Stop offset="1" stopColor={"#F9774B"} />
          </LinearGradient>
        );
      }}
      pointerConfig={{
        pointerStripUptoDataPoint: true,
        pointerStripColor: "lightgray",
        pointerStripWidth: 2,
        strokeDashArray: [8, 8],
        pointerColor: "lightgray",
        radius: 6,
        pointerLabelHeight: 50,
        activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        showPointerStrip: true,
        pointerLabelComponent: (items: any) => {
          return (
            <View
              style={{
                width: 100,
                marginLeft: -22,
              }}
            >
              <Text
                style={
                  style.flatten([
                    "color-white",
                    "h7",
                    "margin-bottom-4",
                    "text-center",
                  ]) as ViewStyle
                }
              >
                {"$" + (items[0].value + 0.6).toFixed(2)}
              </Text>

              <Text
                style={
                  style.flatten(["text-center", "color-gray-200"]) as ViewStyle
                }
              >
                {items[0].date}
              </Text>
            </View>
          );
        },
      }}
    />
  );
};
