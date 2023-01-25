const marketDataRaw = require("../dataSets/coinGecko/ETHOHLC.json");
const Backtest = require("./domain/BackTester");

// get the last 1440 candles
const marketData = marketDataRaw.slice(-120);

const initialWallet = {
  baseCurrency: "usd",
  quoteCurrency: "eth",
  baseAmount: 1000,
  quoteAmount: 0,
};

if (process.argv[2] === "margin-heatmap") {
  (async () => {
    // base config
    const baseConfig = {
      margin: 0.05,
      marginStop: 0.05,
      marginLimit: 0.2,
      maxSoldiers: 10,
      amountPerSoldier: 100,
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
    const configs = configsNested.flat();

    // run the backtest for each config
    const backtestResults = configs.map((config) => {
      const backtest = new Backtest(marketData, config, initialWallet);
      backtest.init();
      const backtestResults = backtest.run();
      return {
        config: backtestResults?.config,
        initialTransaction: backtestResults?.wallet?.transactions[0],
        wallet: { ...backtestResults?.wallet },
      };
    });

    const results = { backtestResults, labels: { ...marginPercentages } };

    // store the results in a file
    const fs = require("fs");
    fs.writeFile(
      "./marginHeatmap.json",
      JSON.stringify(results, null, 2),
      (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      }
    );
  })();
}

if (process.argv[2] === "backtest") {
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
}
