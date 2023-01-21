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
    this.indicators = {};
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

  next(rawDataPoint) {
    const date = new Date(rawDataPoint[0]);
    const open = rawDataPoint[1];
    const high = rawDataPoint[2];
    const low = rawDataPoint[3];
    const close = rawDataPoint[4];
    const margin = this.config.margin;

    const dataPoint = { date, open, high, low, close };

    this.updateIndicators(open, high, low, close, margin);
    this.updateSquads(dataPoint);
  }

  run() {
    // run the backtest on the market data
    for (const rawDataPoint of this.marketData) {
      // run the next simulation cycle
      this.next(rawDataPoint);
    }
    return { ...this };
  }

  updateIndicators(open, high, low, close, margin) {
    return;
  }

  updateSquads(dataPoint) {
    for (const squad of this.squads) {
      squad.next(dataPoint);
    }
  }
}

module.exports = Backtest;
