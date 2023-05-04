import { IDataPoint } from "../../types/domain";

export interface ISoldier {
  id: string;
  quoteAmount: number;
  entryPrice: number;
  stopLoss: number;
  exitPrice: number;
  alive: boolean;
  diedAt: Date | null;
  extracted: boolean;
  extractedAt: Date | null;
  lifeSpan: number;
  balance: number | null;
  profitLoss: number | null;
  next(dataPoint: IDataPoint): void;
  extract(price: number, date: Date): void;
  die(price: number, date: Date): void;
  continue(price: number): void;
  updateBalance(close: number): void;
}
