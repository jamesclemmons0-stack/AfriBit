export default function SignalsPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-green-500 mb-6">
        Trading Signals
      </h1>

      <div className="space-y-4">
        <div className="bg-slate-900 p-5 rounded-xl">
          BTC/USDT — BUY
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          ETH/USDT — SELL
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          SOL/USDT — BUY
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          BNB/USDT — BUY
        </div>
      </div>
    </div>
  );
}