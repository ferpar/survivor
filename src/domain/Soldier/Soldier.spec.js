//basic jest test for Soldier class
const Soldier = require("./Soldier");

const initialConfig = {
  amount: 100,
  entryPrice: 100,
  stopLossPercent: 0.05,
  exitPricePercent: 0.2,
  short: false,
};

let soldier;
beforeEach(() => {
  soldier = new Soldier(...Object.values(initialConfig));
});

describe("Soldier", () => {
  it("should be defined", () => {
    expect(Soldier).toBeDefined();
  });
});

afterEach(() => {
  soldier = null;
});
