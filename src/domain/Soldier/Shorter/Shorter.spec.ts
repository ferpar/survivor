//basic jest test for Shorter class
import { Shorter } from "./Shorter";
import { ISoldierConfig, IDataPoint } from "../../../types/domain";

const shortConfig: ISoldierConfig = {
  amount: 100,
  entryPrice: 100,
  stopLossPercent: 0.05,
  exitPricePercent: 0.2,
};

// this is the data point that will kill the short soldier
const dataPointShort1: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 110, // this is the price that will kill the soldier
  low: 100,
  close: 105,
};

// this is the data point that will extract the short soldier
const dataPointShort2: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 100,
  low: 80, // this is the price that will extract the soldier
  close: 85,
};

// with this dataPoint the short soldier will continue to live
const dataPointShort3: IDataPoint = {
  date: new Date(),
  open: 100,
  high: 90,
  low: 85,
  close: 85,
};

let shortSoldier: Shorter;
beforeEach(() => {
  shortSoldier = new Shorter(shortConfig);
});

describe("Soldier playing short", () => {
  it("dies if the price rises above the stop loss", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.alive).toBe(false);
  });
  it("extracts if the price falls below the exit price", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.extracted).toBe(true);
  });
  it("keeps living if the price stays within the stop loss and exit price", () => {
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.alive).toBe(true);
    expect(shortSoldier.extracted).toBe(false);
  });
  it("increases the lifespan when it continues", () => {
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.lifeSpan).toBe(1);
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.lifeSpan).toBe(2);
  });
  it(`doesn't die if the price rises above the stop loss but the soldier is already extracted`, () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.extracted).toBe(true);
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.alive).toBe(true);
  });
  it("updates the base balance when it continues", () => {
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.baseBalance).toBe(85);
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.baseBalance).toBe(85);
  });
  it("updates the profit loss when it continues", () => {
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.profitLoss).toBe(15);
    shortSoldier.next(dataPointShort3);
    expect(shortSoldier.profitLoss).toBe(15);
  });
  it("updates the profit loss when it extracts", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.profitLoss).toBe(20);
  });
  it("updates the base balance when it extracts", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.baseBalance).toBe(120);
  });
  it("updates the collateral when it extracts", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.collateral).toBe(0);
  });
  it("updates the quoteDebt when it extracts", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.quoteDebt).toBe(0);
  });
  it("updates the profit loss when it dies", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.profitLoss).toBe(-5);
  });
  it("updates the base balance when it dies", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.baseBalance).toBe(95);
  });
  it("updates the collateral when it dies", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.collateral).toBe(0);
  });
  it("updates the quoteDebt when it dies", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.quoteDebt).toBe(0);
  });
  it("does not die after being extracted", () => {
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.extracted).toBe(true);
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.alive).toBe(true);
  });
  it("does not extract after being killed", () => {
    shortSoldier.next(dataPointShort1);
    expect(shortSoldier.alive).toBe(false);
    shortSoldier.next(dataPointShort2);
    expect(shortSoldier.extracted).toBe(false);
  });
});
