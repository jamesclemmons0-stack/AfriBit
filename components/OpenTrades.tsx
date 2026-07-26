"use client";

type Trade = {
  id: number;
  pair: string;
  side: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  status: string;
};

export default function OpenTrades({
  trades,
  onCloseTrade,
}: {
  trades: Trade[];
  onCloseTrade: () => void;
}) {
  async function closeTrade(id: number) {
    try {
      const res = await fetch("/api/trades/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to close trade.");
        return;
      }

      alert("Trade closed successfully!");

      onCloseTrade();
    } catch (error) {
      console.error(error);
      alert("Failed to close trade.");
    }
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 mt-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-green-500 mb-6">
        Open Trades
      </h2>

      {trades.length === 0 ? (
        <p className="text-gray-400">No open trades yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3">Pair</th>
                <th className="text-left">Side</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Entry Price</th>
                <th className="text-left">Current Price</th>
                <th className="text-left">P/L</th>
                <th className="text-left">Status</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40"
                >
                  <td className="py-4">{trade.pair}</td>

                  <td
                    className={
                      trade.side === "BUY"
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {trade.side}
                  </td>

                  <td>{trade.quantity.toFixed(4)}</td>

                  <td>${trade.entryPrice.toFixed(2)}</td>

                  <td>${trade.currentPrice.toFixed(2)}</td>

                  <td
                    className={
                      trade.pnl >= 0
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {trade.pnl >= 0 ? "+" : ""}
                    {trade.pnl.toFixed(2)} USDT
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trade.status === "OPEN"
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>

                  <td>
                    {trade.status === "OPEN" && (
                      <button
                        onClick={() => closeTrade(trade.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}