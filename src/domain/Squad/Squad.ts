import { Soldier } from "../Soldier/Soldier";
import { Shorter } from "../Soldier/Shorter/Shorter";
import { Wallet } from "../Wallet/Wallet";
import { IDataPoint } from "../../types/domain";
import { ISquad, ISquadConfig } from "./Squad.d";
import crypto from "crypto";
import { faker } from "@faker-js/faker";

// takes care of deploying soldiers
export class Squad implements ISquad {
  id: string;
  name: string;
  maxSoldiers: number;
  wallet: Wallet;
  soldierInvestment: number;
  soldiers: Soldier[];
  stopLossPercent: number;
  exitPricePercent: number;
  short: boolean;
  deadSoldiers: Soldier[];
  extractedSoldiers: Soldier[];

  constructor({
    maxSoldiers = 10,
    wallet,
    soldierInvestment = 100,
    stopLossPercent = 0.05,
    exitPricePercent = 0.2,
    short = false,
  }: ISquadConfig) {
    this.id = crypto.randomUUID();
    this.name = faker.location.county();
    this.maxSoldiers = maxSoldiers;
    this.wallet = wallet;
    this.soldierInvestment = soldierInvestment;
    this.soldiers = [];
    this.stopLossPercent = stopLossPercent;
    this.exitPricePercent = exitPricePercent;
    this.short = short;
    this.deadSoldiers = [];
    this.extractedSoldiers = [];
  }

  deploySoldier(dataPoint: IDataPoint) {
    const { open, date } = dataPoint; // soldier deployed at beginning of candle
    // create a new soldier
    const soldier = this.short
      ? new Shorter({
          amount: this.soldierInvestment,
          entryPrice: open,
          stopLossPercent: this.stopLossPercent,
          exitPricePercent: this.exitPricePercent,
        })
      : new Soldier({
          amount: this.soldierInvestment,
          entryPrice: open,
          stopLossPercent: this.stopLossPercent,
          exitPricePercent: this.exitPricePercent,
        });
    // update wallet
    if (this.short) {
      this.wallet.short(this.soldierInvestment, open, date);
    } else {
      this.wallet.buy(this.soldierInvestment, open, date);
    }

    // add soldier to squad
    this.soldiers.push(soldier);
  }

  next(dataPoint: IDataPoint) {
    const { close, date } = dataPoint;
    const deploymentPossible =
      this.soldiers.length < this.maxSoldiers &&
      this.wallet.quoteBalance - this.wallet.collateral >
        this.soldierInvestment;
    // run the next simulation cycle
    if (deploymentPossible) {
      this.deploySoldier(dataPoint);
    }
    for (const soldier of this.soldiers) {
      soldier.next(dataPoint);
      if (!soldier.alive) {
        if (this.short) {
          this.wallet.shortCover(
            soldier.baseAmount * soldier.entryPrice, //making sure we pass the initial investment
            soldier.stopLoss,
            date,
            soldier.entryPrice
          );
        } else {
          this.wallet.sell(
            soldier.balance,
            soldier.stopLoss,
            date,
            soldier.entryPrice
          );
        }
        this.deadSoldiers.push(soldier);
      }
      if (soldier.extracted) {
        if (this.short) {
          this.wallet.shortCover(
            soldier.baseAmount * soldier.entryPrice, //making sure we pass the initial investment
            soldier.exitPrice,
            date,
            soldier.entryPrice
          );
        } else {
          this.wallet.sell(
            soldier.balance,
            soldier.exitPrice,
            date,
            soldier.entryPrice
          );
        }
        this.extractedSoldiers.push(soldier);
      }
    }
    // remove inactive soldiers
    this.soldiers = this.soldiers.filter(
      (soldier) => soldier.alive && !soldier.extracted
    );
  }
}
