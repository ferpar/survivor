import { Soldier } from "../Soldier";
import { ISoldierConfig, IDataPoint } from "../../../types/domain";

// the shorter soldier is a soldier that is shorting the market
export class Shorter extends Soldier {
  quoteDebt: number;
  collateral: number;
  constructor(config: ISoldierConfig) {
    super(config);
    this.quoteDebt = config.amount / config.entryPrice;
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
      this.balance = this.quoteDebt * close;
      this.profitLoss = this.collateral - this.quoteDebt * close;
    } else {
      // if the soldier is dead or extracted
      this.balance = this.alive
        ? this.quoteDebt * (this.entryPrice - this.exitPrice) + this.collateral
        : this.quoteDebt * (this.entryPrice - this.stopLoss) + this.collateral;
      this.profitLoss = this.alive
        ? this.quoteDebt * (this.entryPrice - this.exitPrice)
        : this.quoteDebt * (this.entryPrice - this.stopLoss);
      this.collateral = 0;
      this.quoteDebt = 0;
    }
  }
}
