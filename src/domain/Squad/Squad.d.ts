import { IDataPoint } from "../../types/domain";

export interface ISquad {
  maxSoldiers: number;
  wallet: Wallet;
  soldierInvestment: number;
  soldiers: ISoldier[];
  stopLossPercent: number;
  exitPricePercent: number;
  short: boolean;
  deadSoldiers: ISoldier[];
  extractedSoldiers: ISoldier[];
  next(dataPoint: IDataPoint): void;
  deploySoldier(dataPoint: IDataPoint): void;
}

export interface ISquadConfig {
  maxSoldiers: number;
  wallet: Wallet;
  soldierInvestment: number;
  stopLossPercent: number;
  exitPricePercent: number;
  short: boolean;
}
