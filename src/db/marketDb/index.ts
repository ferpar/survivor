import MarketDb from "./marketDb";
import PostgresDbAdapter from "../PostgresDbAdapter";

const db = new PostgresDbAdapter();

export const marketDb = new MarketDb(db);
