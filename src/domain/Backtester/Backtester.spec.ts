import { Backtester } from "./Backtester";
import { IBacktesterConfig, IBacktester } from "./Backtester.d";
import { IWalletConfig } from "../Wallet/Wallet.d";
import { RawDataPoint } from "../../types/domain";

const rawMarketData: RawDataPoint[] = [
  [1644537600000, 3149.95, 3240.92, 3081.91, 3081.91],
  [1644883200000, 2930.56, 2935.65, 2889.24, 2935.65],
  [1645228800000, 3179.3, 3179.3, 2792.3, 2792.3],
  [1645574400000, 2768.97, 2768.97, 2574.51, 2644.15],
  [1645920000000, 2594.7, 2785.34, 2594.7, 2785.34],
  [1646006400000, 2629.48, 2977.28, 2629.48, 2953.32],
  [1646611200000, 2836.91, 2836.91, 2558.36, 2558.36],
  [1646956800000, 2498.66, 2731.04, 2498.66, 2611.46],
  [1647302400000, 2562.83, 2591.54, 2518.49, 2591.54],
  [1647648000000, 2620.36, 2945.75, 2620.36, 2945.75],
  [1647993600000, 2947.23, 2969.78, 2860.64, 2969.78],
  [1648339200000, 3028.84, 3140.88, 3028.84, 3140.88],
  [1648684800000, 3285.17, 3401.18, 3285.17, 3383.79],
  [1648944000000, 3283.3, 3451.2, 3283.3, 3440.34],
  [1649289600000, 3521.58, 3521.58, 3171.37, 3171.37],
  [1649635200000, 3232.83, 3265.94, 3192.03, 3219.16],
  [1649980800000, 2992.7, 3121.4, 2992.7, 3023.42],
  [1650326400000, 3045.43, 3066.36, 2995.72, 3061.89],
  [1650672000000, 3104.69, 3104.69, 2967.09, 2967.09],
];

const config: IBacktesterConfig = {
  maxSoldiers: 10,
  amountPerSoldier: 100,
  marginStop: 0.04,
  marginLimit: 0.2,
  short: false,
};

const initialWallet: IWalletConfig = {
  quoteAmount: 1000,
  baseAmount: 0,
  quoteCurrency: "ETH",
  baseCurrency: "USD",
};

let backtester: IBacktester;
beforeEach(() => {
  backtester = new Backtester(rawMarketData, config, initialWallet);
});

describe("Backtester", () => {
  it("should be defined", () => {
    expect(Backtester).toBeDefined();
  });
  it("should be able to run", () => {
    expect(backtester.run()).toBeDefined();
  });
  it("should be able to init", () => {
    expect(backtester.squads.length).toBe(0);
    backtester.init();
    expect(backtester.squads.length).toBe(1);
  });
});
