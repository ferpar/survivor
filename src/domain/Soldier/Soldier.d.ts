export interface ISoldier {
  short: boolean;
  quoteAmount: number;
  entryPrice: number;
  stopLoss: number;
  exitPrice: number;
  alive: boolean;
  diedAt: Date | null;
  extracted: boolean;
  extractedAt: Date | null;
  lifeSpan: number;
  baseBalance: number | null;
  profitLoss: number | null;
  next(high: number, low: number, close: number, date: Date): void;
  extract(price: number, date: Date): void;
  die(price: number, date: Date): void;
  continue(price: number): void;
  updateBalance(close: number): void;
}
