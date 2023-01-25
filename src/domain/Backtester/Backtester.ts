import { Wallet } from "../Wallet/Wallet";
import { IWalletConfig } from "../Wallet/Wallet.d";
import { Squad } from "../Squad/Squad";
import { RawDataPoint, IDataPoint } from "../../types/domain";
import { IBacktester, IBacktesterConfig } from "./Backtester.d";

/**
 * Backtest class, used to simulate a trading strategy.
 * @param {Array} marketData - Array of market data with order [timestamp, open, high, low, close, volume]
 * @param {Object} config - Object of configuration options
 * @param {Object} wallet - Object of wallet data
 */
export class Backtester implements IBacktester {
  marketData: RawDataPoint[];
  config: IBacktesterConfig;
  wallet: Wallet;
  squads: Squad[];
  constructor(
    rawMarketData: RawDataPoint[],
    config: IBacktesterConfig,
    initialWallet: IWalletConfig
  ) {
    this.marketData = rawMarketData;
    this.config = config;
    this.wallet = new Wallet({
      baseAmount: initialWallet.baseAmount,
      quoteAmount: initialWallet.quoteAmount,
      baseCurrency: initialWallet.baseCurrency,
      quoteCurrency: initialWallet.quoteCurrency,
    });
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
    const squad1 = new Squad({
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

  next(rawDataPoint: RawDataPoint) {
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
    return { ...this };
  }

  updateSquads(dataPoint: IDataPoint) {
    for (const squad of this.squads) {
      squad.next(dataPoint);
    }
  }
}
