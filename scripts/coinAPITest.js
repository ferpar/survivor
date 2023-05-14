const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "../.env" });

const CoinAPIKey = process.env.COIN_API_KEY;
console.log(CoinAPIKey);
const CoinAPIURL =
  "https://rest.coinapi.io/v1/ohlcv/BINANCE_SPOT_BTC_USDT/history?period_id=1MTH&time_start=2017-08-17T00:00:00&limit=2600";

const apiCall = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CoinAPI-Key": CoinAPIKey,
  },
});

//get ohlcv using axios
async function getOHLCV() {
  try {
    const response = await apiCall(CoinAPIURL);
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
  const allOHLCV = await getOHLCV();
  console.log(allOHLCV);
  await storeResponse(allOHLCV, "BINANCE_BTC_USDT_MONTH.json");
  console.log("Done!");
}

main();
