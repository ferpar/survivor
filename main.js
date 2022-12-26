const marketData = require("./dataSets/coinGecko/ETHOHLC.json");
const Backtester = require("./BackTester");

(async () => {
  const backtester = new Backtester(
    marketData,
    { margin: 0.1 },
    { usd: 1000, eth: 0, balanceUSD: 1000 }
  );
  const backtestResults = await backtester.run();
  console.log(backtestResults);
})();
