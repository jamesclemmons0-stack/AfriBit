"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

type Deposit = {
  id: number;
  amount: number;
  network: string;
  status: string;
  createdAt: string;
};

type Withdrawal = {
  id: number;
  amount: number;
  network: string;
  walletAddress: string;
  status: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();

      setDeposits(data.deposits || []);
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function badge(status: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-600";
      case "REJECTED":
        return "bg-red-600";
      default:
        return "bg-yellow-500 text-black";
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white p-8">

        <h1 className="text-3xl font-bold text-green-500 mb-8">
          Transaction History
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="bg-slate-900 rounded-xl overflow-hidden mb-10">

              <h2 className="text-2xl font-bold p-6">
                Deposit History
              </h2>

              <table className="w-full">

                <thead className="bg-slate-800">

                  <tr>

                    <th className="p-4 text-left">Date</th>

                    <th className="p-4 text-left">Amount</th>

                    <th className="p-4 text-left">Network</th>

                    <th className="p-4 text-left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {deposits.map((deposit) => (

                    <tr
                      key={deposit.id}
                      className="border-b border-slate-800"
                    >

                      <td className="p-4">
                        {new Date(deposit.createdAt).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {deposit.amount.toFixed(2)} USDT
                      </td>

                      <td className="p-4">
                        {deposit.network}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full ${badge(
                            deposit.status
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden">

              <h2 className="text-2xl font-bold p-6">
                Withdrawal History
              </h2>

              <table className="w-full">

                <thead className="bg-slate-800">

                  <tr>

                    <th className="p-4 text-left">Date</th>

                    <th className="p-4 text-left">Amount</th>

                    <th className="p-4 text-left">Network</th>

                    <th className="p-4 text-left">Wallet</th>

                    <th className="p-4 text-left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {withdrawals.map((withdrawal) => (

                    <tr
                      key={withdrawal.id}
                      className="border-b border-slate-800"
                    >

                      <td className="p-4">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {withdrawal.amount.toFixed(2)} USDT
                      </td>

                      <td className="p-4">
                        {withdrawal.network}
                      </td>

                      <td className="p-4 break-all">
                        {withdrawal.walletAddress}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full ${badge(
                            withdrawal.status
                          )}`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}