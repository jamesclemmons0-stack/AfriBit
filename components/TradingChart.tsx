"use client";

export default function TradingChart() {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
      <iframe
        src="https://www.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=15&theme=dark&style=1&locale=en&toolbarbg=%231f2937&hide_top_toolbar=false&hide_legend=false&saveimage=true"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allowFullScreen
      />
    </div>
  );
}