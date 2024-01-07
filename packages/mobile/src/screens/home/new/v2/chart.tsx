import React, { FunctionComponent, useState } from "react";
import { Dimensions, FlatList, Text, View, ViewStyle } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {useStyle} from "styles/index";
import {BlurButton} from "components/new/button/blur-button";
import {CardDivider} from "components/card";
import { LinearGradient, Stop } from "react-native-svg";

export const ChartWithPointer: FunctionComponent<{
  containerStyle?: ViewStyle;
}> = ({ containerStyle }) => {
  const style = useStyle();
  const [selectedId, setSelectedId] = useState<string>("1");
  const [prevSelectedId, setPrevSelectedId] = useState<string>("0");

  const TimeList = [
    { id: "1", title: "24H" },
    { id: "2", title: "1W" },
    { id: "3", title: "1M" },
    { id: "4", title: "3M" },
    { id: "5", title: "1Y" },
    { id: "6", title: "ALL" },
  ];

  const ptData = [
    {
      value: 90,
      date: "1 Apr 2022",
      label: "1 Apr",
      labelTextStyle: { color: "#9A9AA2", width: 60 },
    },
    { value: 110, date: "1 Apr 2022" },
    { value: 99, date: "1 Apr 2022" },
    { value: 90, date: "1 Apr 2022" },
    { value: 100, date: "1 Apr 2022" },
    { value: 160, date: "1 Apr 2022" },
    { value: 190, date: "3 Apr 2022" },
    { value: 180, date: "4 Apr 2022" },
    { value: 200, date: "8 Apr 2022" },

    { value: 220, date: "9 Apr 2022" },
    {
      value: 240,
      date: "10 Apr 2022",
      label: "10 Apr",
      labelTextStyle: { color: "#9A9AA2", width: 60 },
    },
    { value: 280, date: "11 Apr 2022" },
    { value: 360, date: "12 Apr 2022" },
    { value: 340, date: "13 Apr 2022" },
    { value: 385, date: "14 Apr 2022" },
    { value: 390, date: "15 Apr 2022" },
    { value: 400, date: "16 Apr 2022" },

    { value: 390, date: "17 Apr 2022" },
    { value: 385, date: "18 Apr 2022" },
    { value: 395, date: "19 Apr 2022" },
    {
      value: 410,
      date: "20 Apr 2022",
      label: "20 Apr",
      labelTextStyle: { color: "#9A9AA2", width: 60 },
    },
    { value: 420, date: "21 Apr 2022" },
    { value: 395, date: "22 Apr 2022" },
    { value: 360, date: "23 Apr 2022" },
    { value: 455, date: "24 Apr 2022" },

    { value: 490, date: "25 Apr 2022" },
    { value: 420, date: "26 Apr 2022" },
    { value: 405, date: "27 Apr 2022" },
    { value: 430, date: "28 Apr 2022" },
    { value: 450, date: "29 Apr 2022" },
    {
      value: 400,
      date: "30 Apr 2022",
      label: "30 Apr",
      labelTextStyle: { color: "#9A9AA2", width: 60 },
    },
    { value: 440, date: "1 May 2022" },
    { value: 450, date: "2 May 2022" },
    { value: 480, date: "3 May 2022" },
    { value: 450, date: "4 May 2022" },
    { value: 510, date: "5 May 2022" },
  ];

  const renderItem = ({ item }: any) => {
    const selected = item.id === selectedId;
    return (
      <BlurButton
        backgroundBlur={selected}
        text={item.title}
        borderRadius={32}
        textStyle={style.flatten(["body3"]) as ViewStyle}
        containerStyle={style.flatten(["padding-x-4"]) as ViewStyle}
        onPress={() => {
          switch (item.title) {
            case "24H":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );

            case "1W":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );

            case "1M":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );

            case "3M":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );

            case "1Y":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );

            case "ALL":
              return (
                setSelectedId(item.id),
                setPrevSelectedId((Number(item.id) - 1).toString())
              );
          }
        }}
      />
    );
  };

  const renderSeparator = (item: any) => {
    const selected = item.leadingItem.id === selectedId;
    const prevSelected = item.leadingItem.id === prevSelectedId;
    return (
      <View>
        {!selected && !prevSelected ? (
          <CardDivider
            verical={true}
            style={style.flatten(["height-12", "margin-y-10"]) as ViewStyle}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View>
      <View
        style={
          [
            style.flatten(["padding-x-10", "padding-y-28"]),
            containerStyle,
          ] as ViewStyle
        }
      >
        <Text
          style={
            style.flatten([
              "color-white",
              "text-overline",
              "font-extrabold",
              "width-full",
              "text-right",
            ]) as ViewStyle
          }
        >
          {"FET/USD PRICE"}
        </Text>
        <LineChart
          areaChart={true}
          // startFillColor="#F9774B"
          // endFillColor="#5F38FB"
          // startOpacity={0.3}
          // endOpacity={0}
          areaGradientComponent={() => {
            return (
              <LinearGradient id="Gradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={"#F9774B"} stopOpacity={"0.3"} />
                <Stop offset="0.5" stopColor={"#CF447B"} stopOpacity={"0.1"} />
                <Stop offset="1" stopColor={"#5F38FB"} stopOpacity={"0"} />
              </LinearGradient>
            );
          }}
          data={ptData}
          curved={true}
          width={Dimensions.get("window").width - 60}
          isAnimated={true}
          animationDuration={1200}
          animateOnDataChange={true}
          onDataChangeAnimationDuration={300}
          hideDataPoints={true}
          spacing={10}
          thickness={4}
          initialSpacing={4}
          endSpacing={4}
          noOfSections={6}
          stepHeight={40}
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="gray"
          horizontalRulesStyle={style.flatten(["opacity-30"])}
          startIndex={0}
          yAxisTextStyle={{ color: "gray" }}
          xAxisColor="lightgray"
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
          yAxisLabelPrefix="$"
          pointerConfig={{
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            pointerColor: "lightgray",
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items: any) => {
              return (
                <View
                  style={{
                    height: 100,
                    width: 100,
                    justifyContent: "center",
                    marginLeft: -40,
                  }}
                >
                  <Text
                    style={
                      style.flatten([
                        "color-white",
                        "h7",
                        "margin-bottom-6",
                        "text-center",
                      ]) as ViewStyle
                    }
                  >
                    {items[0].date}
                  </Text>

                  <View
                    style={
                      style.flatten([
                        "padding-x-14",
                        "padding-y-6",
                        "border-radius-16",
                        "background-color-white",
                      ]) as ViewStyle
                    }
                  >
                    <Text
                      style={
                        style.flatten(["font-bold", "text-center"]) as ViewStyle
                      }
                    >
                      {"$" + items[0].value + ".0"}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>

      <FlatList
        data={TimeList}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        style={style.flatten(["margin-x-16", "margin-bottom-12"]) as ViewStyle}
        contentContainerStyle={[
          style.flatten(["justify-between", "width-full"]) as ViewStyle,
        ]}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};
