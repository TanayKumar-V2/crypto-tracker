"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

interface News {
  id: string;
  title: string;
  imgUrl: string;
  source: string;
  link: string;
}



function News() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.request({
        url: "https://openapiv1.coinstats.app/news",
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-KEY": "jexVEDRIBRPPynz7CX0zSeiZKDVE+RLTElclXmu6Vbs=",
        },
      });

      console.log(res.data.result);
      setNews(res.data.result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
      <div suppressHydrationWarning>
        {loading ? (
          <div>
            <p className="text-3xl text-center mt-15 animate-bounce">
              LOADING NEWS FROM ALL AROUND THE WORLD
            </p>
            <img
              src="https://openclipart.org/image/2000px/311354"
              height={100}
              width={100}
              alt="spinner"
              className="animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-10  "
            ></img>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
            {news.map((news) => (
              <li
                key={news.id}
                className="flex flex-col rounded-lg shadow-md transition transform hover:scale-105 duration-300"
              >
                {/* Image container with fixed aspect ratio */}
                <div className="w-full relative aspect-video">
                  <img
                    src={news.imgUrl}
                    alt="News"
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                {/* Content container */}
                <div className="p-4">
                  <p className="text-center text-sm font-medium">
                    {news.title}{" "}
                    <span className="text-xs text-gray-500 block">
                      (By: {news.source})
                    </span>
                  </p>
                  <Link
                    href={news.link}
                    target="_blank"
                    className="mt-2 block text-center text-blue-500 hover:underline text-xs"
                  >
                    Read More
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default News;
