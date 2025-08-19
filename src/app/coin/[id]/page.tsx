"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register all necessary Chart.js components
Chart.register(...registerables);

interface CoinDetail {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  price: number;
  priceChange1d: number;
  priceChange1w: number;
  redditUrl?: string;
  twitterUrl?: string;
}

export default function CoinDetails() {
  const { id } = useParams(); // Retrieve the coin id from the URL
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // Fetch the entire coins list
        const res = await axios.get(
          `https://openapiv1.coinstats.app/coins?timestamp=${Date.now()}`,
          {
            headers: {
              accept: "application/json",
              "X-API-KEY": "jexVEDRIBRPPynz7CX0zSeiZKDVE+RLTElclXmu6Vbs=",
            },
          }
        );
        // Find the coin by id from the fetched list (case-insensitive match)
        const foundCoin = res.data.result.find(
          (coin: CoinDetail) => coin.id.toLowerCase() === (typeof id === "string" ? id.toLowerCase() : "")
        );
        if (!foundCoin) {
          setError("Coin not found");
        } else {
          setCoin(foundCoin);
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching coin data:", err);
        setError("Error fetching coin data");
        setLoading(false);
      }
    };

    if (id) {
      fetchCoins();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-3xl text-center mb-90 animate-bounce">LOADING COIN DETAILS...</p>
          <img src="https://storage.needpix.com/rsynced_images/bitcoin-225079_1280.png" alt="Coin img" height={200} width={200} className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20 "></img>
          </div>
      </>
    );
  }

  if (error || !coin) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-red-500">{error || "Coin not found"}</p>
        </div>
      </>
    );
  }

  // Simulate hourly data for the 1-day change.
  // For demonstration, we assume a linear progression from 0 to coin.priceChange1d over 24 hours.
  const oneDayLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const oneDayDataPoints = Array.from({ length: 24 }, (_, i) => {
    return (coin.priceChange1d / 23) * i;
  });

  const oneDayChartData = {
    labels: oneDayLabels,
    datasets: [
      {
        label: "1 Day Price Change (%)",
        data: oneDayDataPoints,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  // Simulate daily data for the 1-week change.
  // For demonstration, we assume a linear progression from 0 to coin.priceChange1w over 7 days.
  const oneWeekLabels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
  const oneWeekDataPoints = Array.from({ length: 7 }, (_, i) => {
    return (coin.priceChange1w / 6) * i;
  });

  const oneWeekChartData = {
    labels: oneWeekLabels,
    datasets: [
      {
        label: "1 Week Price Change (%)",
        data: oneWeekDataPoints,
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.3,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <Link href="/" className="text-blue-500 underline mb-4 inline-block">
          &larr; Back to Coins
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <img src={coin.icon} alt={coin.name} className="w-10 h-10" />
          <h1 className="text-3xl font-bold">
            {coin.name} ({coin.symbol})
          </h1>
        </div>
        <p className="text-xl mb-6">
          Current Price: $
          {coin.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 h-[300px] hover:scale-102 ease-in-out duration-300">
            <h2 className="text-xl font-semibold mb-2">1 Day Performance</h2>
            <Line data={oneDayChartData} options={chartOptions} />
          </div>
          <div className="w-full md:w-1/2 h-[300px] hover:scale-102 ease-in-out duration-300">
            <h2 className="text-xl font-semibold mb-2">1 Week Performance</h2>
            <Line data={oneWeekChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
}
