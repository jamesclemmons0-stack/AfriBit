"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import DashboardLayout from "../../components/DashboardLayout";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const NETWORK = "ERC20";
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Replace these with your real wallet addresses
  const walletAddress =
  "0x2573376abE5921075F35898439351F259f248fBD";

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(walletAddress);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Unable to copy wallet address.");
    }
  }

  async function submitDeposit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          network: NETWORK,
          txHash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Deposit failed.");
      } else {
        setMessage("✅ Deposit submitted successfully.");

        setAmount("");
        setTxHash("");
      }
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-white p-8">

        <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl p-8">

          <h1 className="text-3xl font-bold text-green-500 mb-6">
            Deposit USDT
          </h1>

          {/* Wallet Address */}

          <div className="mb-8">

            <label className="block text-gray-400 mb-3">
              Deposit Wallet Address
            </label>

            <div className="bg-white rounded-xl p-6 flex justify-center mb-5">
              <QRCode
                value={walletAddress}
                size={180}
              />
            </div>

            <div className="flex gap-3">

              <div className="flex-1 bg-slate-800 p-4 rounded-lg break-all text-green-400 font-mono">
                {walletAddress}
              </div>

              <button
                type="button"
                onClick={copyAddress}
                className="bg-green-600 hover:bg-green-700 px-5 rounded-lg font-bold whitespace-nowrap"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>

            </div>

          </div>

          {/* Deposit Instructions */}

          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-5 mb-8">

            <h3 className="text-yellow-400 font-bold mb-3">
              Deposit Instructions
            </h3>

            <ul className="space-y-2 text-gray-300 list-disc ml-6">

              <li>
                Minimum Deposit:
                <strong className="text-white">
                  {" "}100 USDT
                </strong>
              </li>

              <li>
                Deposit only
                <strong className="text-green-400">
                  {" "}USDT
                </strong>
                {" "}using the selected network.
              </li>

              <li>
                Sending funds using the wrong network may permanently lose your crypto.
              </li>

              <li>
                Deposits are manually verified before your wallet is credited.
              </li>

              <li>
                Ensure the transaction hash (TxID) is correct before submitting.
              </li>

            </ul>

          </div>

          {/* Deposit Form */}

          <form onSubmit={submitDeposit} className="space-y-5">

            <div>

              <label className="block mb-2">
                Amount (USDT)
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 outline-none"
                required
              />

            </div>

 <div>
  <label className="block mb-2">
    Network
  </label>

  <div className="w-full rounded-lg border border-green-600 bg-green-900/20 p-3 font-semibold text-green-400">
    Ethereum (ERC-20)
  </div>
</div>

            <div>

              <label className="block mb-2">
                Transaction Hash (TxID)
              </label>

              <textarea
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 outline-none"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition"
            >
              {loading ? "Submitting..." : "Submit Deposit"}
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