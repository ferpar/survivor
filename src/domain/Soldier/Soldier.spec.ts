//basic jest test for Soldier class
import { Soldier } from "./Soldier";
import { ISoldierConfig } from "../../types/domain.d";

const initialConfig: ISoldierConfig = {
  amount: 100,
  entryPrice: 100,
  stopLossPercent: 0.05,
  exitPricePercent: 0.2,
  short: false,
};

let soldier;
beforeEach(() => {
  soldier = new Soldier(initialConfig);
});

describe("Soldier", () => {
  it("should be defined", () => {
    expect(Soldier).toBeDefined();
  });
});

afterEach(() => {
  soldier = null;
});
