const marketDataRaw = require("../../dataSets/coinGecko/ETHOHLC.json");
import { Backtester } from "../domain/Backtester/Backtester";
import { IBacktesterConfig } from "../domain/Backtester/Backtester.d";
import { RawDataPoint } from "../types/domain";
import { IMarginHeatmapInputs } from "../types/domain";

export function getMarginHeatmap({
  baseAmount = 1000,
  startTimestamp,
  quoteAmount = 0,
  endTimestamp,
  maxSoldiers = 10,
  amountPerSoldier = 100,
  short,
}: IMarginHeatmapInputs) {
  // slicing market data by date
  const marketDataSlice = marketDataRaw.filter((datapoint: RawDataPoint) => {
    return datapoint[0] >= startTimestamp && datapoint[0] <= endTimestamp;
  });
  // setting initial wallet
  const initialWallet = {
    baseCurrency: "usd",
    quoteCurrency: "eth",
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
        baseBalance: backtestResults?.wallet?.baseBalance,
        quoteBalance: backtestResults?.wallet?.quoteBalance,
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
