import { Soldier } from "../Soldier";
import { ISoldierConfig, IDataPoint } from "../../../types/domain";

// the shorter soldier is a soldier that is shorting the market
export class Shorter extends Soldier {
  baseDebt: number; // this is the amount of the asset the soldier has
  collateral: number; // this is the amount of collateralized money (quote currency) the soldier has
  constructor(config: ISoldierConfig) {
    super(config);
    this.baseDebt = config.amount / config.entryPrice;
    this.collateral = config.amount;
    this.stopLoss = this.entryPrice * (1 + config.stopLossPercent);
    this.exitPrice = this.entryPrice * (1 - config.exitPricePercent);
  }
  next(datapoint: IDataPoint) {
    //public
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
      // if the soldier is continuing to fight
      this.balance = this.baseDebt * close;
      this.profitLoss = this.collateral - this.baseDebt * close;
    } else {
      // if the soldier is dead or extracted
      this.balance = this.alive
        ? this.baseDebt * (this.entryPrice - this.exitPrice) + this.collateral
        : this.baseDebt * (this.entryPrice - this.stopLoss) + this.collateral;
      this.profitLoss = this.alive
        ? this.baseDebt * (this.entryPrice - this.exitPrice)
        : this.baseDebt * (this.entryPrice - this.stopLoss);
      this.collateral = 0;
      this.baseDebt = 0;
    }
  }
}
