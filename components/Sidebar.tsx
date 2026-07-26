"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        alert("Logout failed.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-green-500 mb-10">
          AfriBit
        </h1>

        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className="block p-3 rounded-lg hover:bg-slate-800"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/wallet"
            className="block p-3 rounded-lg hover:bg-slate-800"
          >
            💰 Wallet
          </Link>

          <Link
            href="/signals"
            className="block p-3 rounded-lg hover:bg-slate-800"
          >
            📈 Signals
          </Link>

          <Link
            href="/history"
            className="block p-3 rounded-lg hover:bg-slate-800"
          >
            📜 Trade History
          </Link>

          <Link
            href="/profile"
            className="block p-3 rounded-lg hover:bg-slate-800"
          >
            👤 Profile
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto w-full rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
      >
        🚪 Logout
      </button>
    </aside>
  );
}