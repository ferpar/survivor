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
const symbolsJsonData = fs.readFileSync("./seeds/allSymbols.json", "utf8");
const periodsJsonData = fs.readFileSync("./seeds/allPeriods.json", "utf8");
const assetsJsonData = fs.readFileSync("./seeds/allAssets.json", "utf8");
const exchangesJsonData = fs.readFileSync("./seeds/allExchanges.json", "utf8");

// Parse the JSON data
const symbolsData = JSON.parse(symbolsJsonData);
const periodsData = JSON.parse(periodsJsonData);
const assetsData = JSON.parse(assetsJsonData);
const exchangesData = JSON.parse(exchangesJsonData);

async function seedDatabase() {
  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query("BEGIN");

    // Loop through the data array and insert each object into the table
    for (const item of symbolsData) {
      await client.query(
        `INSERT INTO symbols (
          symbol_id,
          exchange_id,
          symbol_type,
          asset_id_base,
          asset_id_quote,
          data_start,
          data_end,
          data_quote_start,
          data_quote_end,
          data_orderbook_start,
          data_orderbook_end,
          data_trade_start,
          data_trade_end,
          symbol_id_exchange,
          asset_id_base_exchange,
          asset_id_quote_exchange,
          price_precision,
          size_precision
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          item.symbol_id,
          item.exchange_id,
          item.symbol_type,
          item.asset_id_base,
          item.asset_id_quote,
          item.data_start,
          item.data_end,
          item.data_quote_start,
          item.data_quote_end,
          item.data_orderbook_start,
          item.data_orderbook_end,
          item.data_trade_start,
          item.data_trade_end,
          item.symbol_id_exchange,
          item.asset_id_base_exchange,
          item.asset_id_quote_exchange,
          item.price_precision,
          item.size_precision,
        ]
      );
    }

    // Insert into periods table
    for (const item of periodsData) {
      await client.query(
        `INSERT INTO periods (
      period_id,
      length_seconds,
      length_months,
      unit_count,
      unit_name,
      display_name
    )
    VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.period_id,
          item.length_seconds,
          item.length_months,
          item.unit_count,
          item.unit_name,
          item.display_name,
        ]
      );
    }

    // Loop through the data array and insert each object into the table
    for (const item of assetsData) {
      await client.query(
        `INSERT INTO assets (
          asset_id,
          name,
          type_is_crypto,
          data_quote_start,
          data_quote_end,
          data_orderbook_start,
          data_orderbook_end,
          data_trade_start,
          data_trade_end,
          data_symbols_count,
          volume_1hrs_usd,
          volume_1day_usd,
          volume_1mth_usd,
          price_usd,
          id_icon,
          data_start,
          data_end
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          item.asset_id,
          item.name,
          item.type_is_crypto,
          item.data_quote_start,
          item.data_quote_end,
          item.data_orderbook_start,
          item.data_orderbook_end,
          item.data_trade_start,
          item.data_trade_end,
          item.data_symbols_count,
          item.volume_1hrs_usd,
          item.volume_1day_usd,
          item.volume_1mth_usd,
          item.price_usd,
          item.id_icon,
          item.data_start,
          item.data_end,
        ]
      );
    }

    // Loop through the data array and insert each object into the table
    for (const item of exchangesData) {
      await client.query(
        `INSERT INTO exchanges (
          exchange_id,
          website,
          name,
          data_start,
          data_end,
          data_quote_start,
          data_quote_end,
          data_orderbook_start,
          data_orderbook_end,
          data_trade_start,
          data_trade_end,
          data_symbols_count,
          volume_1hrs_usd,
          volume_1day_usd,
          volume_1mth_usd
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          item.exchange_id,
          item.website,
          item.name,
          item.data_start,
          item.data_end,
          item.data_quote_start,
          item.data_quote_end,
          item.data_orderbook_start,
          item.data_orderbook_end,
          item.data_trade_start,
          item.data_trade_end,
          item.data_symbols_count,
          item.volume_1hrs_usd,
          item.volume_1day_usd,
          item.volume_1mth_usd,
        ]
      );
    }

    // Commit the transaction
    await client.query("COMMIT");

    console.log("Data inserted successfully.");
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
