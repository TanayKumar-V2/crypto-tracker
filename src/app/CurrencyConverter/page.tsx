"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { motion } from "framer-motion";

const API_URL = "https://v6.exchangerate-api.com/v6/047807e70de19195291010ca/latest/USD";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  // Fetch currencies and populate dropdown
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(API_URL);
        const rates = response.data.conversion_rates;

        const currencyOptions = Object.keys(rates).map((currency) => ({
          value: currency,
          label: (
            <span className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/w40/${currency.slice(0, 2).toLowerCase()}.png`}
                alt={currency}
                className="w-6 h-4 object-cover"
              />
              {currency}
            </span>
          ),
        }));

        setCurrencies(currencyOptions);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  // Convert currency
  const convertCurrency = async () => {
    try {
      const response = await axios.get(API_URL);
      const rates = response.data.conversion_rates;
      const conversionRate = rates[toCurrency];
      setResult((amount * conversionRate).toFixed(2));
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/47344/dollar-currency-money-us-dollar-47344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] from-green-300 to-blue-400 p-6 flex flex-col justify-center items-center text-gray-800"
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-gray-200 bg-green-950 p-4 opacity-5 rounded-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        Currency Converter
      </motion.h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">From</label>
          <Select
            options={currencies}
            value={currencies.find((option) => option.value === fromCurrency)}
            onChange={(option) => setFromCurrency(option.value)}
            placeholder="Select currency"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">To</label>
          <Select
            options={currencies}
            value={currencies.find((option) => option.value === toCurrency)}
            onChange={(option) => setToCurrency(option.value)}
            placeholder="Select currency"
          />
        </div>

        <motion.button
          onClick={convertCurrency}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Convert
        </motion.button>

        {result && (
          <motion.div
            className="mt-6 text-center text-lg font-semibold text-green-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {amount} {fromCurrency} = {result} {toCurrency}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default App;