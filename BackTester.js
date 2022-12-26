/**
 * Backtester class, used to simulate a trading strategy, and return wallet data and indicators.
 * @param {Array} marketData - Array of market data
 * @param {Object} config - Object of configuration options
 * @param {Number} config.margin - Margin to use for the simulation
 * @param {Object} wallet - Object of wallet data
 * @param {Number} wallet.usd - USD balance
 * @param {Number} wallet.eth - ETH balance
 * @param {Number} wallet.balanceUSD - USD balance + ETH balance * ETH price
 * @returns {Object} - Object of wallet data and indicators
 */
class Backtester {
  constructor(marketData, config, wallet) {
    this.marketData = marketData;
    this.config = { margin: 0.1, ...config };
    this.wallet = wallet;
    this.indicators = {
      longSurvives: 0,
      shortSurvives: 0,
      openEqHigh: 0,
      openEqLow: 0,
      total: this.marketData.length,
    };
  }

  next(dataPoint) {
    const date = new Date(dataPoint[0]);
    const open = dataPoint[1];
    const high = dataPoint[2];
    const low = dataPoint[3];
    const close = dataPoint[4];
    const margin = this.config.margin;

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

  run() {
    // run the backtest on the market data
    for (const dataPoint of this.marketData) {
      // run the next simulation cycle
      this.next(dataPoint);
    }
    return { wallet: this.wallet, indicators: this.indicators };
  }
}

module.exports = Backtester;
