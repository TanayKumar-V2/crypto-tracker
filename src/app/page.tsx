"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Coin {
  icon: string;
  id: number;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  priceChange1h: number;
  redditUrl: string | null;
  twitterUrl: string | null;
}

export default function Home() {
  const [coin, setCoin] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.request({
        url: `https://openapiv1.coinstats.app/coins?timestamp=${Date.now()}`,
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-KEY": "jexVEDRIBRPPynz7CX0zSeiZKDVE+RLTElclXmu6Vbs=",
        },
      });
      console.log(res.data.result);
      setCoin(res.data.result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        {loading ? (
          <div className="relative min-h-[200px] flex items-center justify-center">
            <span className="text-center text-3xl ">Loading...</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.needpix.com/rsynced_images/bitcoin-225079_1280.png"
              alt="spinner"
              className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20"
              height={70}
              width={70}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl font-bold"></TableHead>
                  <TableHead className="text-xl font-bold">Price</TableHead>
                  <TableHead className="text-xl font-bold">Market Cap</TableHead>
                  <TableHead className="text-xl font-bold">Last 1 hour</TableHead>
                  <TableHead className="text-xl font-bold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coin.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell className="p-6 text-2xl">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coin.icon}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <span className="">
                          <Link href={`/coin/${coin.id}`} target="_blank">
                            {coin.name} ({coin.symbol})
                          </Link>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xl">
                      {coin.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-xl">
                      ${coin.marketCap.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-xl ${
                        coin.priceChange1h < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {coin.priceChange1h}%
                    </TableCell>
                    <TableCell className="flex gap-3">
                      {coin.redditUrl && (
                        <Button variant="outline">
                          <Link
                            href={coin.redditUrl}
                            target="_blank"
                            className="text-orange-500"
                          >
                            Reddit
                          </Link>
                        </Button>
                      )}
                      {coin.twitterUrl && (
                        <Button variant="secondary">
                          <Link href={coin.twitterUrl} target="_blank">
                            Twitter
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}