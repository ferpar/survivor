const {
  getCoinGeckoCoins,
  getCoinGeckoOHLCV,
  getCoinGeckoMarket,
  storeResponse,
} = require("./marketDataUtils");

(async () => {
  const response = await getCoinGeckoMarket("ethereum", "usd", "max");
  storeResponse(response, "ETHCoinGeckoMarket2.json");
})();
