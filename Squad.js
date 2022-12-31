const Soldier = require("./Soldier");

// takes care of deploying soldiers
class Squad {
  constructor(
    maxSoldiers = 10,
    wallet = {},
    soldierAmount = 100,
    stopLossPercent = 0.05,
    exitPricePercent = 0.2,
    short = false
  ) {
    this.maxSoldiers = maxSoldiers;
    this.wallet = wallet;
    this.soldierAmount = soldierAmount;
    this.soldiers = [];
    this.stopLossPercent = stopLossPercent;
    this.exitPricePercent = exitPricePercent;
    this.short = short;
    this.deadSoldiers = [];
    this.extractedSoldiers = [];
  }

  deploySoldier(close) {
    // create a new soldier
    const soldier = new Soldier(
      this.soldierAmount,
      close,
      close * (1 - this.stopLossPercent),
      close * (1 + this.exitPricePercent),
      this.short
    );
    // update wallet
    this.wallet.usd -= this.soldierAmount;
    this.wallet.eth += this.soldierAmount / close;
    // add soldier to squad
    this.soldiers.push(soldier);
  }

  next(high, low, close) {
    const deploymentPossible =
      this.soldiers.length < this.maxSoldiers &&
      this.wallet.usd > this.soldierAmount;
    console.log(deploymentPossible);
    // run the next simulation cycle
    if (deploymentPossible) {
      this.deploySoldier(close);
    }
    for (const soldier of this.soldiers) {
      soldier.next(high, low, close);
      if (!soldier.alive) {
        this.wallet.usd += soldier.balance;
        this.wallet.eth -= soldier.amount / close;
      }
      if (soldier.extracted) {
        this.wallet.usd += soldier.balance;
        this.wallet.eth -= soldier.amount / close;
      }
    }
    for (const soldier of this.soldiers) {
      if (!soldier.alive || soldier.extracted) {
        const outboundSoldier = this.soldiers.splice(
          this.soldiers.indexOf(soldier),
          1
        );
        if (!soldier.alive) {
          this.deadSoldiers.push(outboundSoldier);
        }
        if (soldier.extracted) {
          this.extractedSoldiers.push(outboundSoldier);
        }
      }
    }
  }
}

module.exports = Squad;
