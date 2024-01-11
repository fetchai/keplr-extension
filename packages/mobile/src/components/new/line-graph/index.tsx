import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TabPanel } from "components/new/tab-panel/tab-panel";
import { LineGraph } from "./line-graph";
import axios from "axios";

export enum DurationFilter {
  "24H" = "24H",
  "1W" = "1W",
  "1M" = "1M",
  "3M" = "3M",
  "1Y" = "1Y",
  ALL = "ALL",
}

const tabs = [
  {
    index: 0,
    id: DurationFilter["24H"],
    duration: "1",
  },
  {
    index: 1,
    id: DurationFilter["1W"],
    duration: "7",
  },
  {
    index: 2,
    id: DurationFilter["1M"],
    duration: "30",
  },
  {
    index: 3,
    id: DurationFilter["3M"],
    duration: "90",
  },
  {
    index: 4,
    id: DurationFilter["1Y"],
    duration: "365",
  },
  {
    index: 5,
    id: DurationFilter.ALL,
    duration: "max",
  },
];

interface DurationData {
  [key: string]: DurationObject;
}

interface DurationObject {
  prices: PriceData[];
  tokenState: TokenStateData;
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

export const LineGraphView: FunctionComponent<{
  tokenName: string | undefined;
  setTokenState: any;
  tokenState?: any;
}> = ({ tokenName, setTokenState }) => {
  const [activeTab, setActiveTab] = useState<any>(tabs[0]);
  const [durationData, setDuration] = useState<DurationData>({});
  const [prices, setPrices] = useState<PriceData[]>([]);

  const defaultPricing = useCallback(() => {
    const tokenState: TokenStateData = {
      diff: 0,
      time: "",
      type: "positive",
    };
    const prices = [];
    const timestamp = new Date().getTime();

    for (let i = 0; i < 5; i++) {
      prices.push({ price: 0, timestamp });
    }
    durationData[activeTab.id] = { tokenState, prices };
    setDuration(durationData);
    setPrices(prices);
    setTokenState(tokenState);
  }, []);

  useEffect(() => {
    if (
      !durationData[activeTab.id] ||
      durationData[activeTab.id]?.tokenState?.time?.length == 0
    ) {
      (async function () {
        try {
          let newPrices = [];
          let tokenState = {};
          const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
          const params = { vs_currency: "usd", days: activeTab.duration };

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
            if (activeTab.duration == 1) time = "TODAY";
            else if (activeTab.duration == 7) time = "1 WEEK";
            else if (activeTab.duration == 30) time = "1 MONTH";
            else if (activeTab.duration == 90) time = "3 MONTH";
            else if (activeTab.duration == 365) time = "1 YEAR";
            else if (activeTab.duration == "max") time = "ALL";

            const type = diff >= 0 ? "positive" : "negative";

            tokenState = {
              diff: Math.abs(percentageDiff),
              time,
              type,
            };
            setTokenState(tokenState);
          }
          setPrices(newPrices);
          durationData[activeTab.id] = {
            prices: [...newPrices],
            tokenState: tokenState as TokenStateData,
          };
          setDuration(durationData);
        } catch (error) {
          defaultPricing();
          console.log("Error fetching data:", error.message);
        }
      })();
    } else {
      setPrices(durationData[activeTab.id].prices);
      setTokenState(durationData[activeTab.id].tokenState);
    }
  }, [activeTab, tokenName, setTokenState]);

  return (
    <React.Fragment>
      <LineGraph prices={prices} />
      <TabPanel tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
    </React.Fragment>
  );
};
