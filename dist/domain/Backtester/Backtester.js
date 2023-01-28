"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backtester = void 0;
const Wallet_1 = require("../Wallet/Wallet");
const Squad_1 = require("../Squad/Squad");
/**
 * Backtest class, used to simulate a trading strategy.
 * @param {Array} marketData - Array of market data with order [timestamp, open, high, low, close, volume]
 * @param {Object} config - Object of configuration options
 * @param {Object} wallet - Object of wallet data
 */
class Backtester {
    constructor(rawMarketData, config, initialWallet) {
        this.marketData = rawMarketData;
        this.config = config;
        this.wallet = new Wallet_1.Wallet({
            baseAmount: initialWallet.baseAmount,
            quoteAmount: initialWallet.quoteAmount,
            baseCurrency: initialWallet.baseCurrency,
            quoteCurrency: initialWallet.quoteCurrency,
        });
        this.squads = [];
        // initialize the wallet
        this.wallet.deposit(initialWallet.baseAmount, new Date(this.marketData[0][0]));
    }
    init() {
        // initialize the backtest
        // create a squad
        const squad1 = new Squad_1.Squad({
            maxSoldiers: this.config.maxSoldiers,
            wallet: this.wallet,
            soldierInvestment: this.config.amountPerSoldier,
            stopLossPercent: this.config.marginStop,
            exitPricePercent: this.config.marginLimit,
            short: this.config.short,
        });
        // add squad to squads
        this.squads.push(squad1);
    }
    next(rawDataPoint) {
        const date = new Date(rawDataPoint[0]);
        const open = rawDataPoint[1];
        const high = rawDataPoint[2];
        const low = rawDataPoint[3];
        const close = rawDataPoint[4];
        const dataPoint = { date, open, high, low, close };
        this.updateSquads(dataPoint);
    }
    run() {
        // run the backtest on the market data
        for (const rawDataPoint of this.marketData) {
            // run the next simulation cycle
            this.next(rawDataPoint);
        }
        return Object.assign({}, this);
    }
    updateSquads(dataPoint) {
        for (const squad of this.squads) {
            squad.next(dataPoint);
        }
    }
}
exports.Backtester = Backtester;
