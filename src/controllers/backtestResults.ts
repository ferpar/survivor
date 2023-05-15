// const marketDataRaw = require("../../dataSets/coinGecko/ETHOHLC.json");
const marketDataCoinAPI = require("../../dataSets/coinAPI/BINANCE_BTC_USDT_DAY.json");

import { Backtester } from "../domain/Backtester/Backtester";
import { RawDataPoint } from "../types/domain";
import { IBacktestInputs } from "../types/domain";

const marketDataRaw = marketDataCoinAPI.map((datapoint: any) => {
  return [
    new Date(datapoint.time_period_start).getTime(),
    datapoint.price_open,
    datapoint.price_high,
    datapoint.price_low,
    datapoint.price_close,
    datapoint.volume_traded,
  ];
});

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
