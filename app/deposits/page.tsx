"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

type Deposit = {
  id: number;
  amount: number;
  network: string;
  txHash: string;
  status: string;
  createdAt: string;
};

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeposits() {
      try {
        const res = await fetch("/api/deposits");
        const data = await res.json();

        if (Array.isArray(data)) {
          setDeposits(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDeposits();
  }, []);

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
          Deposit History
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          {loading ? (

            <div className="p-8 text-center">
              Loading deposits...
            </div>

          ) : deposits.length === 0 ? (

            <div className="p-8 text-center text-gray-400">
              No deposits found.
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-slate-800">

                <tr>

                  <th className="p-4 text-left">Date</th>

                  <th className="p-4 text-left">Amount</th>

                  <th className="p-4 text-left">Network</th>

                  <th className="p-4 text-left">Transaction Hash</th>

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

                    <td className="p-4 font-semibold">
                      {deposit.amount.toFixed(2)} USDT
                    </td>

                    <td className="p-4">
                      {deposit.network}
                    </td>

                    <td className="p-4 max-w-xs truncate">
                      {deposit.txHash}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${badge(
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

          )}

        </div>

      </div>
    </DashboardLayout>
  );
}