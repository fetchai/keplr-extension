import React, { FunctionComponent, useEffect, useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import axios from "axios";
import { formatTimestamp } from "utils/format-time-stamp/parse-timestamp-to-date";
import { GraphChart } from "./chart";

interface PriceData {
  timestamp: number;
  price: number;
}

export const LineGraph: FunctionComponent<{
  duration: number;
  tokenName: string | undefined;
  setTokenState: any;
}> = ({ duration, tokenName, setTokenState }) => {
  const style = useStyle();

  const [prices, setPrices] = useState<PriceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        let newPrices: any[] = [];

        const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
        const params = { vs_currency: "usd", days: duration };

        const response = await axios.get(apiUrl, { params });
        newPrices = response.data.prices.map((price: number[]) => ({
          timestamp: price[0],
          price: price[1],
        }));

        if (newPrices.length > 0) {
          const firstValue = newPrices[0].price || 0;
          const lastValue = newPrices[newPrices.length - 1].price || 0;
          const diff = lastValue - firstValue;
          const percentageDiff = (diff / lastValue) * 100;
          let time = "";
          if (duration === 1) time = "TODAY";
          else if (duration === 7) time = "1 WEEK";
          else if (duration === 30) time = "1 MONTH";
          else if (duration === 90) time = "3 MONTH";
          else if (duration === 360) time = "1 YEAR";
          else if (duration === 100000) time = "ALL";

          const type = diff >= 0 ? "positive" : "negative";

          setTokenState({ diff: Math.abs(percentageDiff), time, type });
        }
        setPrices(newPrices);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Unable to fetch data. Please try again.");
      } finally {
        // setLoading(false);
      }
    };

    fetchPrices();
  }, [duration, tokenName, setTokenState]);

  const chartData = {
    labels: prices.map((priceData: any) => {
      const time = formatTimestamp(
        new Date(priceData.timestamp).toLocaleString()
      );
      return time;
    }),
    datasets: [
      {
        label: "",
        data: prices.map((priceData: any) => {
          return {
            value: Number(priceData.price.toFixed(3)),
            date: formatTimestamp(
              new Date(priceData.timestamp).toLocaleString()
            ),
          };
        }),
      },
    ],
  };

  return (
    <View style={[style.flatten(["padding-top-32"])] as ViewStyle}>
      <Text
        style={
          style.flatten([
            "color-white",
            "text-overline",
            "font-extrabold",
            "width-full",
            "text-right",
            "padding-x-20",
          ]) as ViewStyle
        }
      >
        {"FET/USD PRICE"}
      </Text>
      {!error || chartData.datasets[0].data.length !== 0 ? (
        <GraphChart data={chartData.datasets[0].data} />
      ) : (
        <View style={[style.flatten(["padding-y-32"])] as ViewStyle}>
          <Text
            style={
              [
                style.flatten(["h4", "color-red-600", "text-center"]),
              ] as ViewStyle
            }
          >
            Data not available
          </Text>
        </View>
      )}
    </View>
  );
};
