//basic jest test for Soldier class
import { Soldier } from "./Soldier";
import { ISoldierConfig, IDataPoint } from "../../types/domain.d";

const longConfig: ISoldierConfig = {
  amount: 100,
  entryPrice: 100,
  stopLossPercent: 0.05,
  exitPricePercent: 0.2,
};

// this is the data point that will kill the soldier
const dataPointLong1: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 100,
  low: 90, // this is the price that will kill the soldier
  close: 95,
};

// this is the data point that will extract the soldier
const dataPointLong2: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 120, // this is the price that will extract the soldier
  low: 100,
  close: 110,
};

// with this dataPoint the soldier will continue to live
const dataPointLong3: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 110,
  low: 100,
  close: 105,
};

let soldier: Soldier;
beforeEach(() => {
  soldier = new Soldier(longConfig);
});

describe("Soldier playing long", () => {
  it("dies if the price falls below the stop loss", () => {
    soldier.next(dataPointLong1);
    expect(soldier.alive).toBe(false);
  });
  it("extracts if the price rises above the exit price", () => {
    soldier.next(dataPointLong2);
    expect(soldier.extracted).toBe(true);
  });
  it("keeps living if the price stays within the stop loss and exit price", () => {
    soldier.next(dataPointLong3);
    expect(soldier.alive).toBe(true);
    expect(soldier.extracted).toBe(false);
  });
  it("increases the lifespan when it continues", () => {
    soldier.next(dataPointLong3);
    expect(soldier.lifeSpan).toBe(1);
    soldier.next(dataPointLong3);
    expect(soldier.lifeSpan).toBe(2);
  });
  it(`doesn't die if the price falls below the stop loss but the soldier is already extracted`, () => {
    soldier.next(dataPointLong2);
    expect(soldier.extracted).toBe(true);
    soldier.next(dataPointLong1);
    expect(soldier.alive).toBe(true);
  });
  it("updates the base balance when it continues", () => {
    soldier.next(dataPointLong3);
    expect(soldier.baseBalance).toBe(105);
    soldier.next(dataPointLong3);
    expect(soldier.baseBalance).toBe(105);
  });
  it("updates the profit loss when it continues", () => {
    soldier.next(dataPointLong3);
    expect(soldier.profitLoss).toBe(5);
    soldier.next(dataPointLong3);
    expect(soldier.profitLoss).toBe(5);
  });
  it("updates the profit loss when it extracts", () => {
    soldier.next(dataPointLong2);
    expect(soldier.profitLoss).toBe(20);
  });
  it("updates the base balance when it extracts", () => {
    soldier.next(dataPointLong2);
    expect(soldier.baseBalance).toBe(120);
  });
  it("updates the profit loss when it dies", () => {
    soldier.next(dataPointLong1);
    expect(soldier.profitLoss).toBe(-5);
  });
  it("updates the base balance when it dies", () => {
    soldier.next(dataPointLong1);
    expect(soldier.baseBalance).toBe(95);
  });
  it("does not die after being extracted", () => {
    soldier.next(dataPointLong2);
    expect(soldier.extracted).toBe(true);
    soldier.next(dataPointLong1);
    expect(soldier.alive).toBe(true);
  });
  it("does not extract after being killed", () => {
    soldier.next(dataPointLong1);
    expect(soldier.alive).toBe(false);
    soldier.next(dataPointLong2);
    expect(soldier.extracted).toBe(false);
  });
});
