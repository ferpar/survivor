const marketDataRaw = require("../../dataSets/coinGecko/ETHOHLC.json");
import { Backtester } from "../domain/Backtester/Backtester";
import { RawDataPoint } from "../types/domain";
import { IBacktestInputs } from "../types/domain";

export async function getBacktestResults({
  baseAmount = 1000,
  startTimestamp,
  quoteAmount = 0,
  endTimestamp,
  marginStop,
  marginLimit,
  maxSoldiers = 10,
  amountPerSoldier = 100,
  short = false,
}: IBacktestInputs) {
  const marketDataSlice = marketDataRaw.filter((datapoint: RawDataPoint) => {
    return datapoint[0] >= startTimestamp && datapoint[0] <= endTimestamp;
  });

  const initialWallet = {
    baseCurrency: "usd",
    quoteCurrency: "eth",
    baseAmount: baseAmount,
    quoteAmount: quoteAmount,
  };

  const backtest = new Backtester(
    marketDataSlice,
    {
      marginStop,
      marginLimit,
      maxSoldiers,
      amountPerSoldier,
      short,
    },
    initialWallet
  );
  backtest.init();
  const backtestResults = await backtest.run();

  return backtestResults;
}
