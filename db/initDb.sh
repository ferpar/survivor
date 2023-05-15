#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE survivordb;
    \\c survivordb;

    CREATE TABLE periods (
      period_id VARCHAR PRIMARY KEY,
      length_seconds INT NOT NULL,
      length_months INT NOT NULL,
      unit_count INT NOT NULL,
      unit_name VARCHAR(20) NOT NULL,
      display_name VARCHAR(50) NOT NULL
    );

    CREATE TABLE assets (
      asset_id VARCHAR PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type_is_crypto INT NOT NULL,
      data_quote_start TIMESTAMP,
      data_quote_end TIMESTAMP,
      data_orderbook_start TIMESTAMP,
      data_orderbook_end TIMESTAMP,
      data_trade_start TIMESTAMP,
      data_trade_end TIMESTAMP,
      data_symbols_count INT NOT NULL,
      volume_1hrs_usd NUMERIC(30, 8) NOT NULL,
      volume_1day_usd NUMERIC(30, 8) NOT NULL,
      volume_1mth_usd NUMERIC(30, 8) NOT NULL,
      price_usd NUMERIC(30, 16),
      id_icon VARCHAR(36),
      data_start DATE,
      data_end DATE
    );

    CREATE TABLE exchanges (
      exchange_id VARCHAR PRIMARY KEY,
      website VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      data_start DATE,
      data_end DATE,
      data_quote_start TIMESTAMP,
      data_quote_end TIMESTAMP,
      data_orderbook_start TIMESTAMP,
      data_orderbook_end TIMESTAMP,
      data_trade_start TIMESTAMP,
      data_trade_end TIMESTAMP,
      data_symbols_count INT NOT NULL,
      volume_1hrs_usd NUMERIC(30, 8) NOT NULL,
      volume_1day_usd NUMERIC(30, 8) NOT NULL,
      volume_1mth_usd NUMERIC(30, 8) NOT NULL
    );

    CREATE TABLE symbols (
      symbol_id VARCHAR PRIMARY KEY,
      exchange_id VARCHAR NOT NULL,
      symbol_type VARCHAR NOT NULL,
      asset_id_base VARCHAR,
      asset_id_quote VARCHAR,
      asset_id_unit VARCHAR,
      future_contract_unit NUMERIC(20, 9),
      future_contract_unit_asset VARCHAR,
      data_start DATE,
      data_end DATE,
      data_quote_start TIMESTAMP,
      data_quote_end TIMESTAMP,
      data_orderbook_start TIMESTAMP,
      data_orderbook_end TIMESTAMP,
      data_trade_start TIMESTAMP,
      data_trade_end TIMESTAMP,
      volume_1hrs NUMERIC(20, 9),
      volume_1hrs_usd NUMERIC(20, 2),
      volume_1day NUMERIC(20, 9),
      volume_1day_usd NUMERIC(20, 2),
      volume_1mth NUMERIC(20, 9),
      volume_1mth_usd NUMERIC(20, 2),
      price NUMERIC(20, 0),
      symbol_id_exchange VARCHAR,
      asset_id_base_exchange VARCHAR,
      asset_id_quote_exchange VARCHAR,
      price_precision NUMERIC(20, 9),
      size_precision NUMERIC(20, 9)
    );

    CREATE TABLE ohlcv (
      id SERIAL PRIMARY KEY,
      symbol_id VARCHAR NOT NULL,
      period_id VARCHAR(10) NOT NULL,
      time_period_start TIMESTAMP NOT NULL,
      time_period_end TIMESTAMP NOT NULL,
      time_open TIMESTAMP NOT NULL,
      time_close TIMESTAMP NOT NULL,
      price_open NUMERIC(30, 2),
      price_high NUMERIC(30, 2),
      price_low NUMERIC(30, 2),
      price_close NUMERIC(30, 2),
      volume_traded NUMERIC(30, 9),
      trades_count INT,
      FOREIGN KEY (symbol_id) REFERENCES symbols (symbol_id),
      FOREIGN KEY (period_id) REFERENCES periods (period_id)
    );

EOSQL
