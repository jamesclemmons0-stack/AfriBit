"use client";

import { useEffect, useState } from "react";

type Trade = {
  pair: string;
  side: string;
  quantity: number;
  entryPrice: number;
};

export default function TradePanel({
  onOpenTrade,
}: {
  onOpenTrade: (trade: Trade) => void;
}) {
  const [pair, setPair] = useState("BTC/USDT");
  const [side, setSide] = useState("BUY");

  // Amount the user wants to invest
  const [amount, setAmount] = useState(100);

  // Live market price
  const [entryPrice, setEntryPrice] = useState(0);

  // Calculated quantity
  const quantity =
    entryPrice > 0 ? Number((amount / entryPrice).toFixed(8)) : 0;

  async function fetchMarketPrice(selectedPair: string) {
    try {
      const res = await fetch("/api/market");

if (!res.ok) {
  console.warn("Market API is temporarily unavailable.");
  return;
}
      const prices = await res.json();

      const key = selectedPair.replace("/", "");

      if (prices[key]) {
        setEntryPrice(prices[key]);
      }
    } catch (error) {
      console.error(error);
    }
  }

useEffect(() => {
  // Load the selected pair immediately
  fetchMarketPrice(pair);

  // Refresh the selected pair every 5 seconds
  const interval = setInterval(() => {
    fetchMarketPrice(pair);
  }, 5000);

  // Clean up when component unmounts
  return () => clearInterval(interval);
}, [pair]);

  async function openTrade() {
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pair,
          side,
          amount,
          quantity,
          entryPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      onOpenTrade({
        pair,
        side,
        quantity,
        entryPrice,
      });

      alert("Trade opened successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to open trade.");
    }
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-500 mb-6">
        Open Trade
      </h2>

      <div className="space-y-4">
        <div>
          <label>Trading Pair</label>

          <select
            value={pair}
            onChange={(e) => {
              const selected = e.target.value;
              setPair(selected);
              fetchMarketPrice(selected);
            }}
            className="w-full bg-slate-800 rounded-lg p-3 mt-2"
          >
            <option>BTC/USDT</option>
            <option>ETH/USDT</option>
            <option>SOL/USDT</option>
            <option>BNB/USDT</option>
          </select>
        </div>

        <div>
          <label>Direction</label>

          <select
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="w-full bg-slate-800 rounded-lg p-3 mt-2"
          >
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </div>

        <div>
          <label>Trade Amount (USDT)</label>

          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-slate-800 rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label>Current Price</label>

          <input
            value={
              entryPrice > 0
                ? `$${entryPrice.toLocaleString()}`
                : "Loading..."
            }
            disabled
            className="w-full bg-slate-700 rounded-lg p-3 mt-2"
          />
        </div>

        <div>
          <label>Quantity (Auto Calculated)</label>

          <input
            value={quantity}
            disabled
            className="w-full bg-slate-700 rounded-lg p-3 mt-2"
          />
        </div>

<button
  onClick={openTrade}
  disabled={entryPrice === 0}
  className={`w-full rounded-lg py-3 font-semibold transition ${
    entryPrice === 0
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {entryPrice === 0 ? "Loading Market..." : "Open Trade"}
</button>
      </div>
    </div>
  );
}