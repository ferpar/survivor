import { ISoldier } from "./Soldier.d";
import { ISoldierConfig, IDataPoint } from "../../types/domain";

export class Soldier implements ISoldier {
  short: boolean;
  quoteAmount: number;
  entryPrice: number;
  stopLoss: number; // this is the price at which the soldier will die
  exitPrice: number; // this is the price at which the soldier will extract
  alive: boolean;
  diedAt: Date | null;
  extracted: boolean;
  extractedAt: Date | null;
  lifeSpan: number;
  baseBalance: number;
  profitLoss: number;

  constructor({
    short = false,
    amount,
    entryPrice,
    stopLossPercent,
    exitPricePercent,
  }: ISoldierConfig) {
    this.short = short;
    this.quoteAmount = amount / entryPrice;
    this.entryPrice = entryPrice;
    this.stopLoss = this.short
      ? entryPrice * (1 + stopLossPercent)
      : entryPrice * (1 - stopLossPercent);
    this.exitPrice = this.short
      ? entryPrice * (1 - exitPricePercent)
      : entryPrice * (1 + exitPricePercent);
    this.alive = true;
    this.diedAt = null;
    this.extracted = false;
    this.extractedAt = null;
    this.lifeSpan = 0;
    this.baseBalance = amount;
    this.profitLoss = 0;
  }
  next(dataPoint: IDataPoint) {
    const { date, high, low, close } = dataPoint;
    // run the next simulation cycle
    if (this.alive && !this.extracted) {
      if (this.short) {
        if (high >= this.stopLoss) {
          this.die(this.stopLoss, date);
        } else if (low <= this.exitPrice) {
          this.extract(this.exitPrice, date);
        } else {
          this.continue(close);
        }
      } else {
        if (high >= this.exitPrice) {
          this.extract(this.exitPrice, date);
        } else if (low <= this.stopLoss) {
          this.die(this.stopLoss, date);
        } else {
          this.continue(close);
        }
      }
    } else return;
  }

  extract(price: number, date: Date) {
    this.extracted = true;
    this.extractedAt = date;
    this.updateBalance(price);
  }

  die(price: number, date: Date) {
    this.alive = false;
    this.diedAt = date;
    this.updateBalance(price);
  }

  continue(price: number) {
    this.updateBalance(price);
    this.lifeSpan++;
  }

  updateBalance(close: number) {
    if (this.alive && !this.extracted) {
      this.baseBalance = this.quoteAmount * close;
      if (this.short) {
        this.profitLoss = this.quoteAmount * (this.entryPrice - close);
      } else {
        this.profitLoss = this.quoteAmount * (close - this.entryPrice);
      }
    } else {
      this.baseBalance = this.alive
        ? this.quoteAmount * this.exitPrice
        : this.quoteAmount * this.stopLoss;
      if (this.short) {
        this.profitLoss = this.alive
          ? this.quoteAmount * (this.entryPrice - this.exitPrice)
          : this.quoteAmount * (this.entryPrice - this.stopLoss);
      } else {
        this.profitLoss = this.alive
          ? this.quoteAmount * (this.exitPrice - this.entryPrice)
          : this.quoteAmount * (this.stopLoss - this.entryPrice);
      }
    }
  }
}
