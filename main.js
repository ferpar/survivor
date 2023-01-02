const marketData = require("./dataSets/coinGecko/ETHOHLC.json");
const Backtest = require("./BackTester");

const initialWallet = {
  baseCurrency: "usd",
  quoteCurrency: "eth",
  baseAmount: 1000,
  quoteAmount: 0,
};

// (async () => {
//   const margins = Array.from({ length: 25 }, (_, i) => i / 100);

//   const survivability = margins.map((margin) => {
//     const backtest = new Backtest(
//       marketData,
//       { margin },
//       {
//         usd: 1000,
//         eth: 0,
//       }
//     );
//     const backtestResults = backtest.run();
//     return { survivalScore: backtestResults.indicators.survivability, margin };
//   });
//   console.log(survivability);
// })();

(async () => {
  const backtest = new Backtest(
    marketData,
    {
      margin: 0.05,
      marginStop: 0.05,
      maginLimit: 0.2,
      maxSoldiers: 10,
      amountPerSoldier: 100,
    },
    initialWallet
  );
  backtest.init();
  const backtestResults = backtest.run();
  console.log(backtestResults);

  // store the results in a file
  const fs = require("fs");
  fs.writeFile(
    "./results.json",
    JSON.stringify(backtestResults, null, 2),
    (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    }
  );
})();
