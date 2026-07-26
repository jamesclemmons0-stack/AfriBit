export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-green-500">AfriBit</h1>

        <div className="space-x-6">
          <a href="/" className="hover:text-green-400">Home</a>
          <a href="#" className="hover:text-green-400">Markets</a>
          <a href="#" className="hover:text-green-400">Signals</a>
          <a href="/login" className="hover:text-green-400">Login</a>
          <a href="/register" className="hover:text-green-400">
  Register
</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <h2 className="text-6xl font-bold">
          Welcome to <span className="text-green-500">AfriBit</span>
        </h2>

        <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
          Experience a modern simulated crypto trading platform with live market
          data, daily trading signals, and an easy-to-use dashboard.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-green-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-600">
            Get Started
          </button>

          <button className="border border-green-500 px-8 py-3 rounded-lg hover:bg-green-500">
            View Markets
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20">
        <div className="bg-slate-900 rounded-xl p-6 text-center">
          <h3 className="text-4xl font-bold text-green-500">100+</h3>
          <p className="text-gray-400 mt-2">Registered Members</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-center">
          <h3 className="text-4xl font-bold text-green-500">4</h3>
          <p className="text-gray-400 mt-2">Trading Signals Daily</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-center">
          <h3 className="text-4xl font-bold text-green-500">24/7</h3>
          <p className="text-gray-400 mt-2">Platform Availability</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-green-500 mb-12">
          Why Choose AfriBit?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Secure Wallet</h3>
            <p className="text-gray-400">
              Deposit and manage your balance securely.
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Daily Signals</h3>
            <p className="text-gray-400">
              Receive four trading signals every day.
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Real-Time Charts</h3>
            <p className="text-gray-400">
              Analyze the market with live chart data.
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">Trading Dashboard</h3>
            <p className="text-gray-400">
              Monitor your trading activity and progress.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-gray-500">
        © 2026 AfriBit. All Rights Reserved.
        {/* Live Markets */}
<section className="px-8 py-20 bg-slate-900">
  <h2 className="text-4xl font-bold text-center text-green-500 mb-12">
    Live Crypto Markets
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-2xl font-bold">₿ Bitcoin</h3>
      <p className="text-gray-400 mt-2">BTC/USDT</p>
      <p className="text-green-500 text-3xl mt-4">$118,450.25</p>
      <p className="text-green-400">+2.35%</p>
    </div>

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-2xl font-bold">Ξ Ethereum</h3>
      <p className="text-gray-400 mt-2">ETH/USDT</p>
      <p className="text-green-500 text-3xl mt-4">$3,820.40</p>
      <p className="text-green-400">+1.78%</p>
    </div>

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-2xl font-bold">◎ Solana</h3>
      <p className="text-gray-400 mt-2">SOL/USDT</p>
      <p className="text-green-500 text-3xl mt-4">$182.50</p>
      <p className="text-green-400">+4.12%</p>
    </div>

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-2xl font-bold">BNB</h3>
      <p className="text-gray-400 mt-2">BNB/USDT</p>
      <p className="text-green-500 text-3xl mt-4">$725.30</p>
      <p className="text-green-400">+0.96%</p>
    </div>

  </div>
</section>
      </footer>
    </main>
  );
}