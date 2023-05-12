const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "../.env" });

const CoinAPIKey = process.env.COIN_API_KEY;
console.log(CoinAPIKey);
const CoinAPIURL = "https://rest.coinapi.io/v1/exchanges";

const apiCall = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CoinAPI-Key": CoinAPIKey,
  },
});

//get all exchanges using axios
async function getExchanges() {
  try {
    const response = await apiCall(CoinAPIURL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// store the data in the filesystem
async function storeResponse(response, filename) {
  const filePath = path.join(__dirname, ".", "coinAPI", filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(response));
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const allExchanges = await getExchanges();
  console.log(allExchanges);
  await storeResponse(allExchanges, "allExchanges.json");
  console.log("Done!");
}

main();
