const axios = require("axios");
const fs = require("fs");
const path = require("path");

// function to get cryptocurrnecy market historical data from the API
function getMarketData(ticker, currency, days) {
  return axios.get(
    `https://min-api.cryptocompare.com/data/histoday?fsym=${ticker}&tsym=${currency}&limit=${days}`
  );
}

// function to get ETHUSDT market historical data
function getUniswapData() {
  return axios.get(
    "https://api.coingecko.com/api/v3/coins/uniswap/market_chart?vs_currency=usd&days=30&interval=daily"
  );
}

// store the data in the filesystem
function storeResponse(response, filename) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
}

getUniswapData();
storeResponse(getUniswapData(), "uniswap.json");
