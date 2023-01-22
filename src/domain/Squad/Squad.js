const Soldier = require("../Soldier/Soldier");

// takes care of deploying soldiers
class Squad {
  constructor(
    maxSoldiers = 10,
    wallet = {},
    soldierInvestment = 100,
    stopLossPercent = 0.05,
    exitPricePercent = 0.2,
    short = false
  ) {
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

  deploySoldier(close, date) {
    // create a new soldier
    const soldier = new Soldier(
      this.soldierInvestment,
      close,
      this.stopLossPercent,
      this.exitPricePercent,
      this.short
    );
    // update wallet
    this.wallet.buy(this.soldierInvestment, close, date);

    // add soldier to squad
    this.soldiers.push(soldier);
  }

  next(dataPoint) {
    const { close, date } = dataPoint;
    const deploymentPossible =
      this.soldiers.length < this.maxSoldiers &&
      this.wallet.baseBalance > this.soldierInvestment;
    // run the next simulation cycle
    if (deploymentPossible) {
      this.deploySoldier(close, date);
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
        this.deadSoldiers.push({ ...soldier });
      }
      if (soldier.extracted) {
        this.wallet.sell(
          soldier.baseBalance,
          soldier.exitPrice,
          date,
          soldier.entryPrice
        );
        this.extractedSoldiers.push({ ...soldier });
      }
    }
    // remove inactive soldiers
    this.soldiers = this.soldiers.filter(
      (soldier) => soldier.alive && !soldier.extracted
    );
  }
}

module.exports = Squad;
