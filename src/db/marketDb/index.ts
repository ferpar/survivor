import marketDb from "./marketDb";
import PostgresDbAdapter from "../PostgresDbAdapter";

const db = new PostgresDbAdapter();

export const marketsDb = new marketDb(db);
