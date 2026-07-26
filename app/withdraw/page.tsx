"use client";

import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const NETWORK = "ERC20";

  async function submitWithdrawal(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          network: NETWORK,
          walletAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.error || "Withdrawal request failed.");
      } else {
        setMessage("✅ Withdrawal request submitted successfully.");

        setAmount("");
        setWalletAddress("");
      }
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-blue-500 mb-6">
            Withdraw USDT
          </h1>

          {/* Instructions */}

          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-5 mb-8">
            <h3 className="text-yellow-400 font-bold mb-3">
              Withdrawal Instructions
            </h3>

            <ul className="space-y-2 text-gray-300 list-disc ml-6">
              <li>
                Minimum withdrawal:
                <strong className="text-white"> 100 USDT</strong>
              </li>

              <li>
                Withdrawals are currently supported only on the{" "}
                <strong className="text-green-400">
                  Ethereum (ERC-20)
                </strong>{" "}
                network.
              </li>

              <li>
                Ensure your destination wallet address is correct before
                submitting.
              </li>

              <li>
                Withdrawal requests are reviewed manually before being approved.
              </li>

              <li>
                Approved withdrawals will be sent to the wallet address you
                provide below.
              </li>
            </ul>
          </div>

          {/* Withdrawal Form */}

          <form onSubmit={submitWithdrawal} className="space-y-5">
            <div>
              <label className="block mb-2">
                Amount (USDT)
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                Network
              </label>

              <div className="w-full rounded-lg border border-blue-600 bg-blue-900/20 p-3 font-semibold text-blue-400">
                Ethereum (ERC-20)
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Destination Wallet Address
              </label>

              <textarea
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
                placeholder="0x..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Withdrawal"}
            </button>

            {message && (
              <div className="mt-4 text-center font-semibold">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}