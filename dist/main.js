"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marketDataRaw = require("../dataSets/coinGecko/ETHOHLC.json");
const Backtester_1 = require("./domain/Backtester/Backtester");
console.log(process.argv[2]);
// get the last 120 candles
const marketDataSlice = marketDataRaw.slice(-120);
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
            marginStop: 0.05,
            marginLimit: 0.2,
            maxSoldiers: 10,
            amountPerSoldier: 100,
            short: false,
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
                return Object.assign(Object.assign({}, baseConfig), { marginStop, marginLimit });
            });
            return singleRow;
        });
        // flatten the array
        const configs = configsNested.flat();
        // run the backtest for each config
        const backtestResults = configs.map((config) => {
            var _a;
            const backtest = new Backtester_1.Backtester(marketDataSlice, config, initialWallet);
            backtest.init();
            const backtestResults = backtest.run();
            return {
                config: backtestResults === null || backtestResults === void 0 ? void 0 : backtestResults.config,
                initialTransaction: (_a = backtestResults === null || backtestResults === void 0 ? void 0 : backtestResults.wallet) === null || _a === void 0 ? void 0 : _a.transactions[0],
                wallet: Object.assign({}, backtestResults === null || backtestResults === void 0 ? void 0 : backtestResults.wallet),
            };
        });
        const results = { backtestResults, labels: Object.assign({}, marginPercentages) };
        // store the results in a file
        const fs = require("fs");
        fs.writeFile("./marginHeatmap.json", JSON.stringify(results, null, 2), (err) => {
            if (err)
                console.log(err);
            console.log("Successfully Written to File.");
        });
    })();
}
if (process.argv[2] === "backtest") {
    (async () => {
        const backtest = new Backtester_1.Backtester(marketDataSlice, {
            marginStop: 0.05,
            marginLimit: 0.2,
            maxSoldiers: 10,
            amountPerSoldier: 100,
            short: false,
        }, initialWallet);
        backtest.init();
        const backtestResults = backtest.run();
        console.log(backtestResults);
        // store the results in a file
        const fs = require("fs");
        fs.writeFile("./results.json", JSON.stringify(backtestResults, null, 2), (err) => {
            if (err)
                console.log(err);
            console.log("Successfully Written to File.");
        });
    })();
}
