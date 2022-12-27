const marketData = require("./dataSets/coinGecko/ETHOHLC.json");
const Backtest = require("./BackTester");

(async () => {
  const margins = Array.from({ length: 25 }, (_, i) => i / 100);

  const survivability = margins.map((margin) => {
    const backtest = new Backtest(
      marketData,
      { margin },
      {
        usd: 1000,
        eth: 0,
        balanceUSD: 1000,
      }
    );
    const backtestResults = backtest.run();
    return { survivalScore: backtestResults.indicators.survivability, margin };
  });
  console.log(survivability);
})();
