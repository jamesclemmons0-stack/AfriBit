const COINS: Record<string, string> = {
  "BTC/USDT": "bitcoin",
  "ETH/USDT": "ethereum",
  "SOL/USDT": "solana",
  "BNB/USDT": "binancecoin",
};

let cachedPrices: {
  BTCUSDT: number;
  ETHUSDT: number;
  SOLUSDT: number;
  BNBUSDT: number;
} | null = null;

let lastFetch = 0;

const CACHE_TIME = 5000; // 5 seconds

export async function getAllMarketPrices() {
  const now = Date.now();

  if (cachedPrices && now - lastFetch < CACHE_TIME) {
    return cachedPrices;
  }

  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (cachedPrices) {
      return cachedPrices;
    }

    throw new Error("Failed to fetch market prices.");
  }

  const data = await response.json();

  cachedPrices = {
    BTCUSDT: Number(data.bitcoin.usd),
    ETHUSDT: Number(data.ethereum.usd),
    SOLUSDT: Number(data.solana.usd),
    BNBUSDT: Number(data.binancecoin.usd),
  };

  lastFetch = now;

  return cachedPrices;
}

export async function getMarketPrice(pair: string): Promise<number> {
  const prices = await getAllMarketPrices();

  switch (pair) {
    case "BTC/USDT":
      return prices.BTCUSDT;

    case "ETH/USDT":
      return prices.ETHUSDT;

    case "SOL/USDT":
      return prices.SOLUSDT;

    case "BNB/USDT":
      return prices.BNBUSDT;

    default:
      throw new Error(`Unsupported trading pair: ${pair}`);
  }
}