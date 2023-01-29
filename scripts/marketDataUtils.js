const axios = require("axios");
const fs = require("fs");
const path = require("path");

const apiCall = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

// function to get ETHUSDT market historical data
async function getUniswapData() {
  return await apiCall.get(
    "https://api.coingecko.com/api/v3/coins/uniswap/market_chart?vs_currency=usd&days=30&interval=daily"
  );
}

async function getCoinGeckoCoins() {
  return await apiCall.get("https://api.coingecko.com/api/v3/coins/list");
}

async function getCoinGeckoOHLCV(
  coinId = "ethereum",
  baseCurrency = "usd",
  days = "max"
) {
  return await apiCall.get(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=${baseCurrency}&days=${days}`
  );
}

async function getCoinGeckoMarket(
  coinId = "ethereum",
  baseCurrency = "usd",
  days = "max",
  interval = "daily"
) {
  return await apiCall.get(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${baseCurrency}&days=${days}&interval=${interval}`
  );
}

// store the data in the filesystem
async function storeResponse(response, filename) {
  const filePath = path.join(__dirname, "..", "dataSets", filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUniswapData,
  getCoinGeckoCoins,
  getCoinGeckoOHLCV,
  getCoinGeckoMarket,
  storeResponse,
};
