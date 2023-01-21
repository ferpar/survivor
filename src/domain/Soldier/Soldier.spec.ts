//basic jest test for Soldier class
import { Soldier } from "./Soldier";
import { ISoldierConfig, IDataPoint } from "../../types/domain.d";

const initialConfig: ISoldierConfig = {
  amount: 100,
  entryPrice: 100,
  stopLossPercent: 0.05,
  exitPricePercent: 0.2,
  short: false,
};

// this is the data point that will kill the soldier
const dataPoint1: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 100,
  low: 90,
  close: 95,
};

let soldier: Soldier;
beforeEach(() => {
  soldier = new Soldier(initialConfig);
});

describe("Soldier", () => {
  it("should be defined", () => {
    expect(soldier).toBeDefined();
  });
  it("dies if the price falls below the stop loss", () => {
    soldier.next(dataPoint1);
    expect(soldier.alive).toBe(false);
  });
});
