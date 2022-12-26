const {
  getCoinGeckoCoins,
  getCoinGeckoOHLCV,
  getCoinGeckoMarket,
  storeResponse,
} = require("./getMarketData");

(async () => {
  const response = await getCoinGeckoMarket("ethereum", "usd", "max");
  storeResponse(response, "ETHCoinGeckoMarket2.json");
})();
