// const marketDataRaw = require("../../dataSets/coinGecko/ETHOHLC.json");
const marketDataCoinAPI = require("../../dataSets/coinAPI/BINANCE_BTC_USDT_DAY.json");

import { Backtester } from "../domain/Backtester/Backtester";
import { IBacktesterConfig } from "../domain/Backtester/Backtester.d";
import { RawDataPoint } from "../types/domain";
import { IMarginHeatmapInputs } from "../types/domain";
import { marketDb } from "../db/marketDb";
import { coinAPIToArray } from "../helpers";

const marketDataRawDefault = marketDataCoinAPI;

export async function getMarginHeatmap({
  symbol = "BINANCE_SPOT_BTC_USDT",
  period = "1DAY",
  baseAmount = 0,
  startTimestamp,
  quoteAmount = 1000,
  endTimestamp,
  maxSoldiers = 10,
  amountPerSoldier = 100,
  short,
}: IMarginHeatmapInputs) {
  // retrieve market data from db and put in marketDataRaw variable
  const marketDataRaw =
    (await marketDb.getMarketData(symbol, period)).rows || marketDataRawDefault;
  const marketData = coinAPIToArray(marketDataRaw);

  const marketDataSlice = marketData.filter((datapoint: RawDataPoint) => {
    return datapoint[0] >= startTimestamp && datapoint[0] <= endTimestamp;
  });

  // setting initial wallet
  const initialWallet = {
    baseCurrency: "usd",
    quoteCurrency: "btc",
    baseAmount: baseAmount,
    quoteAmount: quoteAmount,
  };
  // base config
  const baseConfig: IBacktesterConfig = {
    marginStop: 0.05,
    marginLimit: 0.2,
    maxSoldiers,
    amountPerSoldier,
    short,
  };
  const marginPercentages = {
    limit: Array.from({ length: 100 }, (_, i) => i + 1),
    stop: Array.from({ length: 25 }, (_, i) => i + 1),
  };
  // generate an array of margins
  const marginsBase = marginPercentages.stop;
  // for each margin, generate 25 arrays of marginStop and marginLimit pairs
  const configsNested = marginsBase.map((margin) => {
    const singleRow = marginPercentages.limit.map((limit) => {
      const marginLimit = limit / 100;
      const marginStop = margin / 100;
      return { ...baseConfig, marginStop, marginLimit };
    });
    return singleRow;
  });

  // flatten the array
  const configs: IBacktesterConfig[] = configsNested.flat();

  // run the backtest for each config
  const backtestResults = configs.map((config) => {
    const backtest = new Backtester(marketDataSlice, config, initialWallet);
    backtest.init();
    const backtestResults = backtest.run();
    return {
      config: backtestResults?.config,
      wallet: {
        balance: backtestResults?.wallet?.balance,
        baseBalance: backtestResults?.wallet?.quoteBalance,
        quoteBalance: backtestResults?.wallet?.baseBalance,
      },
      soldiers: {
        soldiers: backtestResults.squads[0].soldiers.length,
        deadSoldiers: backtestResults.squads[0].deadSoldiers.length,
        extractedSoldiers: backtestResults.squads[0].extractedSoldiers.length,
      },
    };
  });

  const results = { backtestResults, labels: { ...marginPercentages } };

  return results;
}
