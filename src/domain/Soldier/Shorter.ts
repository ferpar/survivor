import { Soldier } from "./Soldier";
import { ISoldierConfig, IDataPoint } from "../../types/domain";

export class Shorter extends Soldier {
  quoteDebt: number;
  collateral: number;
  constructor(config: ISoldierConfig) {
    super(config);
    this.quoteDebt = config.amount / config.entryPrice;
    this.collateral = config.amount;
  }
  next(datapoint: IDataPoint) {
    const { date, high, low, close } = datapoint;
    // run the next simulation cycle
    if (this.alive && !this.extracted) {
      if (high >= this.stopLoss) {
        this.die(this.stopLoss, date);
      } else if (low <= this.exitPrice) {
        this.extract(this.exitPrice, date);
      } else {
        this.continue(close);
      }
    }
  }
  updateBalance(close: number) {
    if (this.alive && !this.extracted) {
      this.baseBalance = this.quoteDebt * close;
      this.profitLoss = this.collateral - this.quoteDebt * close;
    } else {
      this.baseBalance = this.alive
        ? this.quoteDebt * (this.entryPrice - this.exitPrice) + this.collateral
        : this.quoteDebt * (this.entryPrice - this.stopLoss) + this.collateral;
      this.profitLoss = this.alive
        ? this.quoteDebt * (this.entryPrice - this.exitPrice)
        : this.quoteDebt * (this.entryPrice - this.stopLoss);
    }
  }
}
