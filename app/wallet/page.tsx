"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/DashboardLayout";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
};

type WalletSummary = {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  transactions: Transaction[];
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setWallet(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function Card({
    title,
    value,
  }: {
    title: string;
    value: number;
  }) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 shadow">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-3xl font-bold mt-2">
          {value.toFixed(2)} USDT
        </p>
      </div>
    );
  }

  function badge(type: string) {
    switch (type) {
      case "DEPOSIT":
        return "bg-green-600";
      case "WITHDRAWAL":
        return "bg-red-600";
      case "TRADE":
        return "bg-blue-600";
      case "BONUS":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <h1 className="text-3xl font-bold text-green-500 mb-8">
          My Wallet
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : wallet && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card
                title="Available Balance"
                value={wallet.balance}
              />

              <Card
                title="Approved Deposits"
                value={wallet.totalDeposits}
              />

              <Card
                title="Approved Withdrawals"
                value={wallet.totalWithdrawals}
              />

              <Card
                title="Pending Deposits"
                value={wallet.pendingDeposits}
              />

              <Card
                title="Pending Withdrawals"
                value={wallet.pendingWithdrawals}
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/deposit"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                Deposit
              </Link>

              <Link
                href="/withdraw"
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
              >
                Withdraw
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                Transaction History
              </h2>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Description</th>
                    </tr>
                  </thead>

                  <tbody>
                    {wallet.transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-gray-400"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      wallet.transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-t border-slate-800"
                        >
                          <td className="p-4">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleString()}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${badge(
                                transaction.type
                              )}`}
                            >
                              {transaction.type}
                            </span>
                          </td>

                          <td
                            className={`p-4 font-bold ${
                              transaction.type === "WITHDRAWAL"
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {transaction.type === "WITHDRAWAL"
                              ? "-"
                              : "+"}
                            {transaction.amount.toFixed(2)} USDT
                          </td>

                          <td className="p-4">
                            {transaction.description}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}