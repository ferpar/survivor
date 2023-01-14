const Wallet = require("./Wallet");
const Squad = require("./Squad");

/**
 * Backtest class, used to simulate a trading strategy, and return wallet data and indicators.
 * @param {Array} marketData - Array of market data
 * @param {Object} config - Object of configuration options
 * @param {Number} config.margin - Margin to use for the simulation
 * @param {Object} wallet - Object of wallet data
 * @returns {Object} - Object of wallet data and indicators
 */
class Backtest {
  constructor(marketData, config = {}, initialWallet = {}) {
    this.marketData = marketData;
    this.config = config;
    this.wallet = new Wallet(
      initialWallet.baseCurrency,
      initialWallet.quoteCurrency
    );
    this.indicators = {
      longSurvives: 0,
      shortSurvives: 0,
      openEqHigh: 0,
      openEqLow: 0,
      total: this.marketData.length,
      survivability: null,
    };
    this.squads = [];

    // initialize the wallet
    this.wallet.deposit(
      initialWallet.baseAmount,
      new Date(this.marketData[0][0])
    );
  }

  init() {
    // initialize the backtest
    // create a squad
    const squad1 = new Squad(
      this.config.maxSoldiers,
      this.wallet,
      this.config.amountPerSoldier,
      this.config.marginStop,
      this.config.marginLimit,
      true
    );
    // add squad to squads
    this.squads.push(squad1);
  }

  next(dataPoint) {
    const date = new Date(dataPoint[0]);
    const open = dataPoint[1];
    const high = dataPoint[2];
    const low = dataPoint[3];
    const close = dataPoint[4];
    const margin = this.config.margin;

    this.updateIndicators(open, high, low, close, margin);
    this.updateSquads(high, low, close, date);
  }

  run() {
    // run the backtest on the market data
    for (const dataPoint of this.marketData) {
      // run the next simulation cycle
      this.next(dataPoint);
    }
    this.indicators.survivability = this.findSurvivability();
    return { ...this };
  }

  updateIndicators(open, high, low, close, margin) {
    if (low > (1 - margin) * open) {
      this.indicators.longSurvives++;
    }

    if (high < (1 + margin) * open) {
      this.indicators.shortSurvives++;
    }

    if (open === high) {
      this.indicators.openEqHigh++;
    }

    if (open === low) {
      this.indicators.openEqLow++;
    }
  }

  updateSquads(high, low, close, date) {
    for (const squad of this.squads) {
      squad.next(high, low, close, date);
    }
  }

  findSurvivability() {
    return (
      (this.indicators.longSurvives + this.indicators.shortSurvives) /
      (this.indicators.total * 2)
    );
  }
}

module.exports = Backtest;
