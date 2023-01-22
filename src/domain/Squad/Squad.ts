import { Soldier } from "../Soldier/Soldier";
import { Shorter } from "../Soldier/Shorter/Shorter";
import { Wallet } from "../Wallet/Wallet";
import { IDataPoint } from "../../types/domain";
import { ISquad, ISquadConfig } from "./Squad.d";

// takes care of deploying soldiers
export class Squad implements ISquad {
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
    this.wallet.buy(this.soldierInvestment, open, date);

    // add soldier to squad
    this.soldiers.push(soldier);
  }

  next(dataPoint: IDataPoint) {
    const { close, date } = dataPoint;
    const deploymentPossible =
      this.soldiers.length < this.maxSoldiers &&
      this.wallet.baseBalance > this.soldierInvestment;
    // run the next simulation cycle
    if (deploymentPossible) {
      this.deploySoldier(dataPoint);
    }
    for (const soldier of this.soldiers) {
      soldier.next(dataPoint);
      if (!soldier.alive) {
        this.wallet.sell(
          soldier.baseBalance,
          soldier.stopLoss,
          date,
          soldier.entryPrice
        );
        this.deadSoldiers.push(soldier);
      }
      if (soldier.extracted) {
        this.wallet.sell(
          soldier.baseBalance,
          soldier.exitPrice,
          date,
          soldier.entryPrice
        );
        this.extractedSoldiers.push(soldier);
      }
    }
    // remove inactive soldiers
    this.soldiers = this.soldiers.filter(
      (soldier) => soldier.alive && !soldier.extracted
    );
  }
}
