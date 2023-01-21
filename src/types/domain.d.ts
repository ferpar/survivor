export interface ISoldierConfig {
  amount: number;
  entryPrice: number;
  stopLossPercent: number;
  exitPricePercent: number;
  short: boolean;
}

export interface IDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IRawDataPoint {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
