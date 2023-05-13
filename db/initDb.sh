#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE survivordb;
    \\c survivordb;

    CREATE TABLE time_interval (
      id SERIAL PRIMARY KEY,
      interval_name VARCHAR(10) NOT NULL,
      interval_seconds INT NOT NULL
    );

    CREATE TABLE source (
      id VARCHAR PRIMARY KEY,
      source_name VARCHAR(20) NOT NULL,
      api_key VARCHAR(50) NOT NULL,
      secret_key VARCHAR(50) NOT NULL,
      base_url VARCHAR(100) NOT NULL,
      website_url VARCHAR(100) NOT NULL
    );

    CREATE TABLE market_data (
      id SERIAL PRIMARY KEY,
      market_pair VARCHAR(10) NOT NULL,
      time_interval_id INT NOT NULL,
      source_id VARCHAR NOT NULL,
      open NUMERIC(10, 2) NOT NULL,
      high NUMERIC(10, 2) NOT NULL,
      low NUMERIC(10, 2) NOT NULL,
      close NUMERIC(10, 2) NOT NULL,
      volume NUMERIC(20, 8) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      FOREIGN KEY (time_interval_id) REFERENCES time_interval(id),
      FOREIGN KEY (source_id) REFERENCES source(id)
    );

EOSQL
