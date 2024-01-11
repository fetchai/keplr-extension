import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { formatTimestamp } from "utils/format-time-stamp/parse-timestamp-to-date";
import { PriceData } from ".";
import { GraphChart } from "./chart";

export const LineGraph: FunctionComponent<{
  prices: PriceData[];
}> = ({ prices }) => {
  const style = useStyle();

  const chartData = {
    labels: prices.map((priceData: PriceData) => {
      return formatTimestamp(priceData.timestamp);
    }),
    datasets: [
      {
        label: "",
        data: prices.map((priceData: PriceData) => {
          return {
            value: Number(priceData.price.toFixed(3)),
            date: formatTimestamp(priceData.timestamp),
          };
        }),
      },
    ],
  };

  return (
    <View style={[style.flatten(["padding-top-32"])] as ViewStyle}>
      <GraphChart data={chartData.datasets[0].data} />
    </View>
  );
};
