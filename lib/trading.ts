export function calculateQuantity(
  amount: number,
  entryPrice: number
): number {
  if (entryPrice <= 0) {
    throw new Error("Invalid entry price.");
  }

  return Number((amount / entryPrice).toFixed(8));
}

export function calculateTradeValue(
  quantity: number,
  entryPrice: number
): number {
  return Number((quantity * entryPrice).toFixed(2));
}

export function calculatePnL(
  side: string,
  entryPrice: number,
  currentPrice: number,
  quantity: number
): number {
  let pnl = 0;

  if (side === "BUY") {
    pnl = (currentPrice - entryPrice) * quantity;
  } else {
    pnl = (entryPrice - currentPrice) * quantity;
  }

  return Number(pnl.toFixed(2));
}