const marketDataCoinAPI = require("../../dataSets/coinAPI/BINANCE_BTC_USDT_DAY.json");
import { Backtester } from "../domain/Backtester/Backtester";
import { RawDataPoint } from "../types/domain";
import { IBacktestInputs } from "../types/domain";
import { marketDb } from "../db/marketDb";
import { coinAPIToArray } from "../helpers";

const marketDataRawDefault = marketDataCoinAPI;

export async function getBacktestResults({
  symbol = "BINANCE_SPOT_BTC_USDT",
  period = "1DAY",
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
  // retrieve market data from db and put in marketDataRaw variable
  const marketDataRaw =
    (await marketDb.getMarketData(symbol, period)).rows || marketDataRawDefault;
  const marketData = coinAPIToArray(marketDataRaw);

  const marketDataSlice = marketData.filter((datapoint: RawDataPoint) => {
    return datapoint[0] >= startTimestamp && datapoint[0] <= endTimestamp;
  });

  const initialWallet = {
    baseCurrency: "usd",
    quoteCurrency: "btc",
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
