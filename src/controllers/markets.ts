import { marketDb } from "../db/marketDb";

export async function getMarkets() {
  return (await marketDb.getMarketsWithData()).rows;
}
