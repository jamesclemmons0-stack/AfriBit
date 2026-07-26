"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import TradingChart from "../../components/TradingChart";
import TradePanel from "../../components/TradePanel";
import OpenTrades from "../../components/OpenTrades";

type Trade = {
  id: number;
  pair: string;
  side: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  exitPrice?: number;
  pnl: number;
  status: string;
};

export default function DashboardPage() {

  function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
  const router = useRouter();

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [tradingVolume, setTradingVolume] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userName, setUserName] = useState("Trader");

  const [activity, setActivity] = useState<{
  deposits: any[];
  withdrawals: any[];
  trades: any[];
}>({

  deposits: [],
  withdrawals: [],
  trades: [],
});

const totalDeposits = activity.deposits.reduce(
  (sum: number, deposit: any) => sum + deposit.amount,
  0
);

const totalWithdrawals = activity.withdrawals.reduce(
  (sum: number, withdrawal: any) => sum + withdrawal.amount,
  0
);

const totalPnL = trades.reduce(
  (sum, trade) => sum + trade.pnl,
  0
);

  const loadDashboard = useCallback(async () => {
    try {
const [walletRes, tradesRes, activityRes] = await Promise.all([
  fetch("/api/wallet"),
  fetch("/api/trades"),
  fetch("/api/dashboard/activity"),
]);

      if (walletRes.status === 401 || tradesRes.status === 401) {
        router.replace("/login");
        return;
      }

      const wallet = await walletRes.json();
      const loadedTrades: Trade[] = await tradesRes.json();
      const activityData = await activityRes.json();

      const meRes = await fetch("/api/me");

if (meRes.ok) {
  const me = await meRes.json();
  setUserName(me.name || "Trader");
}

      if (wallet && typeof wallet.balance === "number") {
        setWalletBalance(wallet.balance);
      } else {
        setWalletBalance(0);
      }

      setTrades(Array.isArray(loadedTrades) ? loadedTrades : []);

      setActivity(activityData);

const volume = Array.isArray(loadedTrades)
  ? loadedTrades.reduce(
      (sum, trade) => sum + trade.quantity * trade.entryPrice,
      0
    )
  : 0;

      setTradingVolume(volume);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setWalletBalance(0);
      setTradingVolume(0);
      setTrades([]);
    }
  }, [router]);
  const refreshLiveTrades = useCallback(async () => {
  try {
    await fetch("/api/trades/live");
    await loadDashboard();
  } catch (error) {
    console.error("Live refresh failed:", error);
  }
}, [loadDashboard]);

async function handleOpenTrade() {
  await loadDashboard();
  toast.success("Trade opened successfully!");
}
async function handleCloseTrade() {
  await loadDashboard();
  toast.success("Trade closed successfully!");
}

useEffect(() => {
  // Load dashboard immediately
  loadDashboard();

  // Refresh live trades every 5 seconds
  const interval = setInterval(async () => {
    await refreshLiveTrades();
  }, 5000);

  // Clean up when leaving the page
  return () => clearInterval(interval);
}, [loadDashboard, refreshLiveTrades]);

  return (
    <DashboardLayout>
<header className="border-b border-slate-800 p-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    <div>
      <p className="text-gray-400 text-sm">
        Welcome back 👋
      </p>

      <h1 className="text-4xl font-bold mt-2">
        {userName}
      </h1>

      <p className="text-gray-400 mt-2">
        Trade smart. Grow your portfolio.
      </p>
    </div>

    <div className="bg-slate-900 rounded-xl px-6 py-4 min-w-[240px]">
      <p className="text-gray-400 text-sm">
        Available Balance
      </p>

      <p className="text-3xl font-bold text-green-500 mt-2">
        {walletBalance.toFixed(2)} USDT
      </p>
    </div>

  </div>
</header>

        <div className="p-8">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

<div className="bg-slate-900 rounded-xl p-6 shadow-lg">
  <h3 className="text-gray-400 text-sm">
    Total Deposits
  </h3>

  <p className="text-3xl font-bold text-cyan-400 mt-3">
   {totalDeposits.toFixed(2)} USDT
  </p>
</div>

  <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
    <h3 className="text-gray-400 text-sm">
      Trading Volume
    </h3>

    <p className="text-3xl font-bold text-yellow-400 mt-3">
      {tradingVolume.toFixed(2)} USDT
    </p>
  </div>

<div className="bg-slate-900 rounded-xl p-6 shadow-lg">
  <h3 className="text-gray-400 text-sm">
    Profit / Loss
  </h3>

  <p
    className={`text-3xl font-bold mt-3 ${
      totalPnL >= 0 ? "text-green-400" : "text-red-400"
    }`}
  >
    {totalPnL >= 0 ? "+" : ""}
    {totalPnL.toFixed(2)} USDT
  </p>
</div>

  <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
    <h3 className="text-gray-400 text-sm">
      Open Trades
    </h3>

    <p className="text-3xl font-bold text-purple-400 mt-3">
      {trades.length}
    </p>
  </div>

  <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
  <h3 className="text-gray-400 text-sm">
    Total Withdrawals
  </h3>

  <p className="text-3xl font-bold text-red-400 mt-3">
    {totalWithdrawals.toFixed(2)} USDT
  </p>
</div>

</div>

          <div className="bg-slate-900 rounded-xl p-6 mb-8">
            <div className="flex justify-between mb-2">
              <span>Withdrawal Progress</span>

              <span>
                {Math.min((tradingVolume / 2000) * 100, 100).toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{
                  width: `${Math.min(
                    (tradingVolume / 2000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="text-gray-400 mt-3">
              Required Trading Volume:
              <strong> 2,000 USDT</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4">
              <h2 className="text-2xl font-bold mb-4">
                Live Market
              </h2>

              <TradingChart />
            </div>

            <TradePanel onOpenTrade={handleOpenTrade} />
          </div>

<div className="bg-slate-900 rounded-xl p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    Quick Actions
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <button
      onClick={() => router.push("/deposit")}
      className="bg-green-600 hover:bg-green-700 rounded-lg p-5 transition"
    >
      <div className="text-3xl mb-2">💰</div>
      <p className="font-semibold">Deposit</p>
    </button>

    <button
      onClick={() => router.push("/withdraw")}
      className="bg-red-600 hover:bg-red-700 rounded-lg p-5 transition"
    >
      <div className="text-3xl mb-2">💸</div>
      <p className="font-semibold">Withdraw</p>
    </button>

    <button
      onClick={() => router.push("/history")}
      className="bg-blue-600 hover:bg-blue-700 rounded-lg p-5 transition"
    >
      <div className="text-3xl mb-2">📜</div>
      <p className="font-semibold">History</p>
    </button>

    <button
      onClick={() => router.push("/wallet")}
      className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-5 transition"
    >
      <div className="text-3xl mb-2">👛</div>
      <p className="font-semibold">Wallet</p>
    </button>

  </div>
</div>

          <OpenTrades
            trades={trades}
            onCloseTrade={handleCloseTrade}
          />
          <div className="bg-slate-900 rounded-xl p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    Recent Activity
  </h2>

  <div className="space-y-4">

    {activity.deposits.map((deposit: any) => (
      <div
        key={`deposit-${deposit.id}`}
        className="flex justify-between border-b border-slate-800 pb-3"
      >
        <div>
  <p className="font-semibold text-green-400">
    Deposit
  </p>

  <span
    className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${
      deposit.status === "APPROVED"
        ? "bg-green-500/20 text-green-400"
        : deposit.status === "PENDING"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {deposit.status}
  </span>

  <p className="text-xs text-gray-500 mt-2">
  {formatDate(deposit.createdAt)}
  </p>
</div>

        <p className="font-bold">
          +{deposit.amount} USDT
        </p>
      </div>
    ))}

    {activity.withdrawals.map((withdrawal: any) => (
  <div
    key={`withdrawal-${withdrawal.id}`}
    className="flex justify-between border-b border-slate-800 pb-3"
  >
    <div>
  <p className="font-semibold text-red-400">
    Withdrawal
  </p>

  <span
    className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${
      withdrawal.status === "APPROVED"
        ? "bg-green-500/20 text-green-400"
        : withdrawal.status === "PENDING"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {withdrawal.status}
  </span>

  <p className="text-xs text-gray-500 mt-2">
{formatDate(withdrawal.createdAt)}
  </p>
</div>

    <p className="font-bold">
      -{withdrawal.amount} USDT
    </p>
  </div>
))}

{activity.trades.map((trade: any) => (
  <div
    key={`trade-${trade.id}`}
    className="flex justify-between border-b border-slate-800 pb-3"
  >
    <div>
  <p className="font-semibold text-blue-400">
  {trade.side} {trade.pair}
  </p>

  <span
    className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${
      trade.status === "OPEN"
        ? "bg-blue-500/20 text-blue-400"
        : trade.status === "CLOSED"
        ? "bg-gray-500/20 text-gray-300"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {trade.status}
  </span>

  <p className="text-xs text-gray-500 mt-2">
{formatDate(trade.createdAt)} 
  </p>
</div>

    <p className="font-bold">
    {(trade.quantity * trade.entryPrice).toFixed(2)} USDT
    </p>
  </div>
))}

  </div>
</div>

      </div>
    </DashboardLayout>
  );
}