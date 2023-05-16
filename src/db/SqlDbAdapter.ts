import { QueryResult, PoolClient } from "pg";

export interface SqlDbAdapter {
  query: (text: string, params?: any[], callback?: any) => Promise<QueryResult>;
  shutdown: () => Promise<void>;
  connect: () => Promise<PoolClient>;
}
