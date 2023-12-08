import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { TabsPanel } from "@components-v2/tabsPanel";
import style from "./style.module.scss";

interface PriceData {
  timestamp: number;
  price: number;
}

interface LineGraphProps {
  duration: number;
  tokenName: string;
}

interface LineGraphViewProps {
  tokenName: string;
}

export const LineGraphView: React.FC<LineGraphViewProps> = ({ tokenName }) => {
  const tabs = [
    { id: "24H", component: <LineGraph duration={1} tokenName={tokenName} /> },
    { id: "1W", component: <LineGraph duration={7} tokenName={tokenName} /> },
    { id: "1M", component: <LineGraph duration={30} tokenName={tokenName} /> },
    { id: "3M", component: <LineGraph duration={90} tokenName={tokenName} /> },
    { id: "1Y", component: <LineGraph duration={360} tokenName={tokenName} /> },
    {
      id: "All",
      component: <LineGraph duration={10000} tokenName={tokenName} />,
    },
  ];

  return <TabsPanel tabs={tabs} showTabsOnBottom={true} />;
};

export const LineGraph: React.FC<LineGraphProps> = ({
  duration,
  tokenName,
}) => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
        const params = { vs_currency: "usd", days: duration };

        const response = await axios.get(apiUrl, { params });
        const pricesFromResponse = response.data.prices.map(
          (price: number[]) => ({ timestamp: price[0], price: price[1] })
        );
        setPrices(pricesFromResponse);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [duration, tokenName]);

  const chartData = {
    labels: prices.map(() => ""),
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
    scales: {
      xAxes: [{ gridLines: { display: false } }],
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
          return `${label} ${value} USD`;
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
