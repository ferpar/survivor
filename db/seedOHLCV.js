const { Pool } = require("pg");
const fs = require("fs");
// const path = require("path");
// require("dotenv").config({ path: "../.env" });

// Create a new pool with your PostgreSQL connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "survivordb",
  password: "postgres",
  port: 5432, // Change the port if necessary
});

// Read the JSON files
const BinanceBTCUSDTDailyJson = fs.readFileSync(
  "./seeds/BINANCE_BTC_USDT_DAY.json",
  "utf8"
);
const BinanceBTCUSDTWeeklyJson = fs.readFileSync(
  "./seeds/BINANCE_BTC_USDT_WEEK.json",
  "utf8"
);
const BinanceBTCUSDTMonthlyJson = fs.readFileSync(
  "./seeds/BINANCE_BTC_USDT_MONTH.json",
  "utf8"
);

const BinanceETHUSDTDailyJson = fs.readFileSync(
  "./seeds/BINANCE_ETH_USDT_DAY.json",
  "utf8"
);
const BinanceETHUSDTWeeklyJson = fs.readFileSync(
  "./seeds/BINANCE_ETH_USDT_WEEK.json",
  "utf8"
);
const BinanceETHUSDTMonthlyJson = fs.readFileSync(
  "./seeds/BINANCE_ETH_USDT_MONTH.json",
  "utf8"
);

// Parse the JSON data
const BinanceBTCUSDTDailyData = JSON.parse(BinanceBTCUSDTDailyJson);
const BinanceBTCUSDTWeeklyData = JSON.parse(BinanceBTCUSDTWeeklyJson);
const BinanceBTCUSDTMonthlyData = JSON.parse(BinanceBTCUSDTMonthlyJson);

const BinanceETHUSDTDailyData = JSON.parse(BinanceETHUSDTDailyJson);
const BinanceETHUSDTWeeklyData = JSON.parse(BinanceETHUSDTWeeklyJson);
const BinanceETHUSDTMonthlyData = JSON.parse(BinanceETHUSDTMonthlyJson);

const allMarkets = [
  {
    series: BinanceBTCUSDTDailyData,
    period_id: "1DAY",
    symbol_id: "BINANCE_SPOT_BTC_USDT",
  },
  {
    series: BinanceBTCUSDTWeeklyData,
    period_id: "7DAY",
    symbol_id: "BINANCE_SPOT_BTC_USDT",
  },
  {
    series: BinanceBTCUSDTMonthlyData,
    period_id: "1MTH",
    symbol_id: "BINANCE_SPOT_BTC_USDT",
  },
  {
    series: BinanceETHUSDTDailyData,
    period_id: "1DAY",
    symbol_id: "BINANCE_SPOT_ETH_USDT",
  },
  {
    series: BinanceETHUSDTWeeklyData,
    period_id: "7DAY",
    symbol_id: "BINANCE_SPOT_ETH_USDT",
  },
  {
    series: BinanceETHUSDTMonthlyData,
    period_id: "1MTH",
    symbol_id: "BINANCE_SPOT_ETH_USDT",
  },
];

async function seedDatabase() {
  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query("BEGIN");

    // For each ohlcvSeries in the allMarkets array
    for (const market of allMarkets) {
      for (const candle of market.series) {
        await client.query(
          `INSERT INTO ohlcv (
            symbol_id,
            period_id,
            time_period_start,
            time_period_end,
            time_open,
            time_close,
            price_open,
            price_high,
            price_low,
            price_close,
            volume_traded,
            trades_count
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            market.symbol_id,
            market.period_id,
            candle.time_period_start,
            candle.time_period_end,
            candle.time_open,
            candle.time_close,
            candle.price_open,
            candle.price_high,
            candle.price_low,
            candle.price_close,
            candle.volume_traded,
            candle.trades_count,
          ]
        );
      }
    }

    // Commit the transaction
    await client.query("COMMIT");

    console.log("OHLCV Data inserted successfully.");
  } catch (error) {
    // Rollback the transaction if an error occurs
    await client.query("ROLLBACK");
    console.error("Error inserting data:", error);
  } finally {
    client.release(); // Release the database connection
    pool.end(); // Close the pool
  }
}

// Call the seedDatabase function
seedDatabase();
