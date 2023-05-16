import { SqlDbAdapter } from "../SqlDbAdapter";
import { availablePeriods } from "../../constants";
import { QueryResult } from "pg";

export interface IMarketDb {
  db: SqlDbAdapter;
  getExchanges: () => Promise<QueryResult>;
  getPeriods: () => Promise<QueryResult>;
  getMarketData: (symbol_id: string, period_id: string) => Promise<QueryResult>;
  getAssets: () => Promise<QueryResult>;
  getSymbolsByExchange: (exchange_id: string) => Promise<QueryResult>;
  getSymblosByBaseAsset: (asset_id: string) => Promise<QueryResult>;
}

export default class MarketDb implements MarketDb {
  db: SqlDbAdapter;
  constructor(db: SqlDbAdapter) {
    this.db = db;
  }

  getMarketsWithData() {
    return this.db.query(
      "SELECT DISTINCT t.symbol_id, t.period_id, s.exchange_id, s.symbol_type, s.asset_id_base, s.asset_id_quote FROM ohlcv t LEFT JOIN symbols s ON t.symbol_id = s.symbol_id"
    );
  }

  getExchanges() {
    return this.db.query("SELECT * FROM exchanges");
  }

  getPeriods() {
    return this.db.query(
      "SELECT * FROM periods WHERE period_id = ANY($1::text[])",
      [availablePeriods]
    );
  }

  getMarketData(symbol_id: string, period_id: string) {
    return this.db.query(
      "SELECT * FROM ohlcv WHERE symbol_id = $1 AND period_id = $2",
      [symbol_id, period_id]
    );
  }

  getAssets() {
    return this.db.query("SELECT * FROM assets");
  }

  getSymbolsByExchange(exchange_id: string) {
    return this.db.query("SELECT * FROM symbols WHERE exchange_id = $1", [
      exchange_id,
    ]);
  }

  getSymblosByBaseAsset(asset_id: string) {
    return this.db.query("SELECT * FROM symbols WHERE asset_id_base = $1", [
      asset_id,
    ]);
  }
}
