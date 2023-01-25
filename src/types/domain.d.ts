export interface ISoldierConfig {
  amount: number;
  entryPrice: number;
  stopLossPercent: number;
  exitPricePercent: number;
}

export interface IDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type RawDataPointWithVolume = [
  number,
  number,
  number,
  number,
  number,
  number
];
export type RawDataPointWithoutVolume = [
  number,
  number,
  number,
  number,
  number
];

export type RawDataPoint = RawDataPointWithVolume | RawDataPointWithoutVolume;
