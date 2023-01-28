"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squad = void 0;
const Soldier_1 = require("../Soldier/Soldier");
const Shorter_1 = require("../Soldier/Shorter/Shorter");
// takes care of deploying soldiers
class Squad {
    constructor({ maxSoldiers = 10, wallet, soldierInvestment = 100, stopLossPercent = 0.05, exitPricePercent = 0.2, short = false, }) {
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
    deploySoldier(dataPoint) {
        const { open, date } = dataPoint; // soldier deployed at beginning of candle
        // create a new soldier
        const soldier = this.short
            ? new Shorter_1.Shorter({
                amount: this.soldierInvestment,
                entryPrice: open,
                stopLossPercent: this.stopLossPercent,
                exitPricePercent: this.exitPricePercent,
            })
            : new Soldier_1.Soldier({
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
    next(dataPoint) {
        const { close, date } = dataPoint;
        const deploymentPossible = this.soldiers.length < this.maxSoldiers &&
            this.wallet.baseBalance > this.soldierInvestment;
        // run the next simulation cycle
        if (deploymentPossible) {
            this.deploySoldier(dataPoint);
        }
        for (const soldier of this.soldiers) {
            soldier.next(dataPoint);
            if (!soldier.alive) {
                this.wallet.sell(soldier.balance, soldier.stopLoss, date, soldier.entryPrice);
                this.deadSoldiers.push(soldier);
            }
            if (soldier.extracted) {
                this.wallet.sell(soldier.balance, soldier.exitPrice, date, soldier.entryPrice);
                this.extractedSoldiers.push(soldier);
            }
        }
        // remove inactive soldiers
        this.soldiers = this.soldiers.filter((soldier) => soldier.alive && !soldier.extracted);
    }
}
exports.Squad = Squad;
