"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js"
import Navbar from "@/components/Navbar";

Chart.register(...registerables);

interface Coins {
  id: string;
  name: string;
  priceChange1d: number;
  priceChange1w: number;
}

function ChartComp() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const heads = {
    url: `https://openapiv1.coinstats.app/coins?timestamp=${Date.now()}`,
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "jexVEDRIBRPPynz7CX0zSeiZKDVE+RLTElclXmu6Vbs=",
    },
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.request(heads);
      setCoins(res.data.result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error fetching data: {error.message}
      </div>
    );
  }

  const coinNames = coins.map((coin) => coin.name);
  const priceChange1d = coins.map((coin) => coin.priceChange1d);
  const priceChange1w = coins.map((coin) => coin.priceChange1w);

  const oneDayChartData = {
    labels: coinNames,
    datasets: [
      {
        label: "Price Change 1 Day (%)",
        data: priceChange1d,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const oneWeekChartData = {
    labels: coinNames,
    datasets: [
      {
        label: "Price Change 1 Week (%)",
        data: priceChange1w,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <div>
        {loading ? (
          <div>
            <p className="text-3xl text-center">Loading the Charts</p>
          </div>
        ) : (
          <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Coin Performance</h1>

            <div className="mb-10" style={{ height: "300px" }}>
              <h2 className="text-xl font-semibold mb-2">1 Day Performance</h2>
              <Bar data={oneDayChartData} options={options} />
            </div>

            <div style={{ height: "300px" }}>
              <h2 className="text-xl font-semibold mb-2">1 Week Performance</h2>
              <Bar data={oneWeekChartData} options={options} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ChartComp;
