import { SqlDbAdapter } from "./SqlDbAdapter";
import { QueryResult, PoolClient } from "pg";

const { SqlDbAdapter } = require("./SqlDbAdapter");

const { Pool } = require("pg");
// get env variables using dotenv
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on("error", (err: any) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default class PostgresDbAdapter implements SqlDbAdapter {
  pool: any;
  constructor() {
    this.pool = pool;
  }
  // to run queries on the pool
  query(text: any, params?: any[], callback?: any): Promise<QueryResult> {
    return pool.query(text, params, callback);
  }
  // to shutdown the pool
  shutdown(): Promise<void> {
    return pool.end();
  }
  // to get a new client from the pool
  connect(): Promise<PoolClient> {
    return pool.connect();
  }
}
