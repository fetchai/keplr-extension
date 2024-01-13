import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { formatTimestamp } from "utils/format-time-stamp/parse-timestamp-to-date";
import { View, ViewStyle } from "react-native";
import { GraphChart } from "components/new/line-graph/chart";
import { useStyle } from "styles/index";

export enum DurationFilter {
  "24H" = "24H",
  "1W" = "1W",
  "1M" = "1M",
  "3M" = "3M",
  "1Y" = "1Y",
  ALL = "ALL",
}

interface DurationData {
  [key: string]: DurationObject;
}

interface DurationObject {
  prices: PriceData[];
  tokenState: TokenStateData;
  isError: boolean;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

interface TokenStateData {
  diff: number;
  time: string;
  type: "positive" | "negative";
}

export const LineGraph: FunctionComponent<{
  tokenName: string | undefined;
  duration: string;
  setTokenState: any;
  tokenState?: any;
}> = ({ tokenName, duration, setTokenState }) => {
  const style = useStyle();

  const [durationData, setDuration] = useState<DurationData>({});
  const [prices, setPrices] = useState<PriceData[]>([]);

  const cacheKey = useMemo(
    () => `${tokenName}_${duration}`,
    [tokenName, duration]
  );

  function getTimeLabel() {
    switch (duration) {
      default:
      case "1":
        return "TODAY";
      case "7":
        return "1 WEEK";
      case "30":
        return "1 MONTH";
      case "90":
        return "3 MONTH";
      case "365":
        return "1 YEAR";
      case "max":
        return "ALL";
    }
  }

  const setDefaultPricing = useCallback(() => {
    const tokenState: TokenStateData = {
      diff: 0,
      time: getTimeLabel(),
      type: "positive",
    };
    const prices = [];
    const timestamp = new Date().getTime();

    for (let i = 0; i < 5; i++) {
      prices.push({ price: 0, timestamp });
    }

    durationData[cacheKey] = {
      prices: [...prices],
      tokenState: tokenState as TokenStateData,
      isError: true,
    };

    setPrices(prices);
    setTokenState(tokenState);
    setDuration(durationData);
  }, [tokenName, duration]);

  useEffect(() => {
    if (
      (durationData[cacheKey]?.prices.length ?? 0) == 0 ||
      (durationData[cacheKey]?.isError ?? false)
    ) {
      (async function () {
        try {
          let newPrices = [];
          let tokenState = {};
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

            const type = diff >= 0 ? "positive" : "negative";

            tokenState = {
              diff: Math.abs(percentageDiff),
              time: getTimeLabel(),
              type,
            };
            setTokenState(tokenState);
          }
          setPrices(newPrices);
          durationData[cacheKey] = {
            prices: [...newPrices],
            tokenState: tokenState as TokenStateData,
            isError: false,
          };
          setDuration(durationData);
        } catch (error) {
          setDefaultPricing();
          console.log("Error fetching data:", error.message);
        }
      })();
    } else {
      setTokenState(durationData[cacheKey].tokenState);
      setPrices(durationData[cacheKey].prices);
    }
  }, [cacheKey]);

  const chartData = {
    labels:
      prices.map((priceData: PriceData) => {
        return formatTimestamp(priceData.timestamp);
      }) ?? [],
    datasets: [
      {
        label: "",
        data:
          prices.map((priceData: PriceData) => {
            return {
              value: Number(priceData.price.toFixed(3)),
              date: formatTimestamp(priceData.timestamp),
            };
          }) ?? [],
      },
    ],
  };

  return (
    <View
      style={[style.flatten(["margin-top-32", "overflow-hidden"])] as ViewStyle}
    >
      <GraphChart data={chartData.datasets[0].data} />
    </View>
  );
};
