const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "../.env" });

const CoinAPIKey = process.env.COIN_API_KEY;
console.log(CoinAPIKey);
const CoinAPIURL = "https://rest.coinapi.io/v1/assets";

const apiCall = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CoinAPI-Key": CoinAPIKey,
  },
});

//get all assets using axios
async function getAssets() {
  try {
    const response = await apiCall(CoinAPIURL);
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
  const allAssets = await getAssets();
  console.log(allAssets);
  await storeResponse(allAssets, "allAssets.json");
  console.log("Done!");
}

main();
