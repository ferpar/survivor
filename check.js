const marketData = require("./marginHeatmap.json");

const results = marketData.backtestResults.map((market) => {
  const info = {
    stop: market.config.marginStop,
    limit: market.config.marginLimit,
    balance: market.wallet.balance,
    extractedSoldiers: market.soldiers.extractedSoldiers,
    deadSoldiers: market.soldiers.deadSoldiers,
    soldiers: market.soldiers.soldiers,
  };
  return info;
});

const singleBacktest = require("./results.json");
