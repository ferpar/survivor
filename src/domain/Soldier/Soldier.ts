import { ISoldier } from "./Soldier.d";
import { ISoldierConfig, IDataPoint } from "../../types/domain";
import crypto from "crypto";
import { faker } from "@faker-js/faker";

export class Soldier implements ISoldier {
  id: string;
  name: string;
  baseAmount: number; // this is the amount of the asset the soldier has
  entryPrice: number;
  stopLoss: number; // this is the price at which the soldier will die
  exitPrice: number; // this is the price at which the soldier will extract
  alive: boolean;
  diedAt: Date | null;
  extracted: boolean;
  extractedAt: Date | null;
  lifeSpan: number;
  balance: number; // this is the amount of money (quote currency) the soldier has
  profitLoss: number;

  constructor({
    amount, // amount invested in the soldier in quote currency
    entryPrice,
    stopLossPercent,
    exitPricePercent,
  }: ISoldierConfig) {
    this.id = crypto.randomUUID();
    this.name = faker.person.fullName({ sex: "male" });
    this.baseAmount = amount / entryPrice;
    this.entryPrice = entryPrice;
    this.stopLoss = entryPrice * (1 - stopLossPercent);
    this.exitPrice = entryPrice * (1 + exitPricePercent);
    this.alive = true;
    this.diedAt = null;
    this.extracted = false;
    this.extractedAt = null;
    this.lifeSpan = 0;
    this.balance = amount;
    this.profitLoss = 0;
  }
  next(dataPoint: IDataPoint) {
    //public
    const { date, high, low, close } = dataPoint;
    // run the next simulation cycle
    if (this.alive && !this.extracted) {
      if (high >= this.exitPrice) {
        this.extract(this.exitPrice, date);
      } else if (low <= this.stopLoss) {
        this.die(this.stopLoss, date);
      } else {
        this.continue(close);
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
      // if the soldier is continuing to fight
      this.balance = this.baseAmount * close;
      this.profitLoss = this.baseAmount * (close - this.entryPrice);
    } else {
      // if the soldier is dead or has extracted
      this.balance = this.alive
        ? this.baseAmount * this.exitPrice
        : this.baseAmount * this.stopLoss;
      this.profitLoss = this.alive
        ? this.baseAmount * (this.exitPrice - this.entryPrice)
        : this.baseAmount * (this.stopLoss - this.entryPrice);
    }
  }
}
