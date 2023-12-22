import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { TabsPanel } from "@components-v2/tabs/tabsPanel";
import style from "./style.module.scss";
import { formatTimestamp } from "@utils/parse-timestamp-to-date";

interface LineGraphProps {
  duration: number;
  tokenName: string | undefined;
  setTokenState: any;
  isActiveTab: boolean;
}

interface PriceData {
  timestamp: number;
  price: number;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  duration,
  tokenName,
  setTokenState,
  isActiveTab,
}) => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = useMemo(
    () => `${tokenName}_${duration}`,
    [tokenName, duration]
  );

  const cachedPrices = useMemo(() => {
    const cachedData = sessionStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  }, [cacheKey]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        let newPrices: never[] = [];

        if (cachedPrices) {
          newPrices = cachedPrices;
        } else {
          const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
          const params = { vs_currency: "usd", days: duration };

          const response = await axios.get(apiUrl, { params });
          newPrices = response.data.prices.map((price: number[]) => ({
            timestamp: price[0],
            price: price[1],
          }));

          sessionStorage.setItem(cacheKey, JSON.stringify(newPrices));
        }

        setPrices((prevPrices) => [...prevPrices, ...newPrices]);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [duration, tokenName, cacheKey, cachedPrices]);

  useEffect(() => {
    if (prices.length > 0) {
      const firstValue = prices[0].price || 0;
      const lastValue = prices[prices.length - 1].price || 0;
      const diff = lastValue - firstValue;
      const percentageDiff = (diff / lastValue) * 100;

      if (isActiveTab) {
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
    }
  }, [prices, duration, isActiveTab, setTokenState]);

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
        backgroundColor: "transparent",
        data: prices.map((priceData: any) =>
          priceData.price.toFixed(3).toString()
        ),
        fill: false,
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (
            !chartArea ||
            !isFinite(chartArea.left) ||
            !isFinite(chartArea.top) ||
            !isFinite(chartArea.right) ||
            !isFinite(chartArea.bottom)
          ) {
            return null;
          }

          const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.right,
            chartArea.bottom
          );
          gradient.addColorStop(0.226488, "#5F38FB");
          gradient.addColorStop(0.547025, "#CF447B");
          gradient.addColorStop(0.856046, "#F9774B");

          return gradient;
        },
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions: ChartOptions = {
    legend: { display: false },
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
          gridLines: { display: false },
          ticks: { display: false },
        },
      ],
      yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
    },
    tooltips: {
      backgroundColor: "transparent",
      bodyFontColor: "rgba(255,255,255,0.6)",
      displayColors: false,
      caretSize: 0,
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const label = data.datasets[tooltipItem.datasetIndex].label || "";
          const value = tooltipItem.yLabel || "";
          return ` ${label} ${value} USD`;
        },
      },
    },
  };

  return (
    <div className={style["graph-container"]}>
      {loading ? (
        <div>
          {error ? (
            <div>{error}</div>
          ) : (
            <div>
              Loading...
              <i
                className="fas fa-spinner fa-spin ml-2"
                style={{ color: "white" }}
              />
            </div>
          )}
        </div>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

interface LineGraphViewProps {
  tokenName: string | undefined;
  setTokenState: any;
}

export const LineGraphView: React.FC<LineGraphViewProps> = ({
  tokenName,
  setTokenState,
}) => {
  const [activeTab, setActiveTab] = useState<string>("24H");

  const tabs = [
    {
      id: "24H",
      component: (
        <LineGraph
          duration={1}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={activeTab === "24H"}
        />
      ),
    },
    {
      id: "1W",
      component: (
        <LineGraph
          duration={7}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={activeTab === "1W"}
        />
      ),
    },
    {
      id: "1M",
      component: (
        <LineGraph
          duration={30}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={activeTab === "1M"}
        />
      ),
    },
    {
      id: "3M",
      component: (
        <LineGraph
          duration={90}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={activeTab === "3M"}
        />
      ),
    },
    {
      id: "1Y",
      component: (
        <LineGraph
          duration={360}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={activeTab === "1Y"}
        />
      ),
    },
    {
      id: "All",
      component: (
        <LineGraph
          duration={100000}
          tokenName={tokenName}
          setTokenState={setTokenState}
          isActiveTab={false}
        />
      ),
    },
  ];

  return (
    <div>
      <TabsPanel
        tabs={tabs}
        showTabsOnBottom={true}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
