const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "../.env" });

const CoinAPIKey = process.env.COIN_API_KEY;

const exchange = "BINANCE";
const asset_id_quote = "ETH";
const asset_id_base = "USDT";
const time_start = "2017-08-17T00:00:00";
const limit = 2600;

const period_day = "1DAY";
const period_week = "7DAY";
const period_month = "1MTH";

const getCoinAPIURL = (period) => {
  return `https://rest.coinapi.io/v1/ohlcv/${exchange}_SPOT_${asset_id_quote}_${asset_id_base}/history?period_id=${period}&time_start=${time_start}&limit=${limit}`;
};

const apiCall = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CoinAPI-Key": CoinAPIKey,
  },
});

//get ohlcv using axios
async function getMarketData(period) {
  try {
    const response = await apiCall(getCoinAPIURL(period));
    console.log(response.headers);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// store the data in the filesystem
async function storeResponse(response, filename) {
  const filePath = path.join(__dirname, ".", "coinAPIData", filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(response));
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const dailyOHLCV = await getMarketData(period_day);
  await storeResponse(
    dailyOHLCV,
    `${exchange}_${asset_id_quote}_${asset_id_base}_DAY.json`
  );
  const weeklyOHLCV = await getMarketData(period_week);
  await storeResponse(
    weeklyOHLCV,
    `${exchange}_${asset_id_quote}_${asset_id_base}_WEEK.json`
  );
  const monthlyOHLCV = await getMarketData(period_month);
  await storeResponse(
    monthlyOHLCV,
    `${exchange}_${asset_id_quote}_${asset_id_base}_MONTH.json`
  );
  console.log("Done!");
}

main();
