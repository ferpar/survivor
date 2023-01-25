import { RawDataPoint, IDataPoint } from "../../types/domain";
import { Wallet } from "../Wallet/Wallet";
import { Squad } from "../Squad/Squad";

export interface IBacktesterConfig {
  maxSoldiers: number;
  amountPerSoldier: number;
  marginStop: number;
  marginLimit: number;
  short: boolean;
}

export interface IBacktester {
  marketData: RawDataPoint[];
  config: IBacktestConfig;
  wallet: Wallet;
  squads: Squad[];
  init(): void;
  next(rawDataPoint: RawDataPoint): void;
  updateSquads(rawDataPoint: IDataPoint): void;
  run(): void;
}
