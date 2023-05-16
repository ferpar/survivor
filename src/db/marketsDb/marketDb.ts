import { SqlDbAdapter } from "../SqlDbAdapter";
import { availablePeriods } from "../../constants";

export default class marketDb {
  db: SqlDbAdapter;
  constructor(db: SqlDbAdapter) {
    this.db = db;
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
