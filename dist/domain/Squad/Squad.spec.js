"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Squad_1 = require("./Squad");
const Wallet_1 = require("../Wallet/Wallet");
const initialWallet = {
    baseCurrency: "USD",
    quoteCurrency: "ETH",
    baseAmount: 1000,
    quoteAmount: 0,
};
const squadConfig = () => ({
    maxSoldiers: 10,
    wallet: new Wallet_1.Wallet(initialWallet),
    soldierInvestment: 100,
    stopLossPercent: 0.05,
    exitPricePercent: 0.2,
    short: false,
});
const squadConfigShort = {
    maxSoldiers: 10,
    wallet: initialWallet,
    soldierInvestment: 100,
    stopLossPercent: 0.05,
    exitPricePercent: 0.2,
    short: true,
};
const dataPointLong1 = {
    // this data point is used to deploy a soldier / continue a trade
    date: new Date(),
    open: 100,
    high: 110,
    low: 97,
    close: 102,
};
const dataPointLong2 = {
    // this data point is used to kill a soldier
    date: new Date(),
    open: 100,
    high: 110,
    low: 93,
    close: 102,
};
const dataPointLong3 = {
    // this data point is used to extract a soldier
    date: new Date(),
    open: 100,
    high: 120,
    low: 97,
    close: 102,
};
let squad;
beforeEach(() => {
    squad = new Squad_1.Squad(squadConfig());
});
describe("Squad playing long", () => {
    it("deploys a soldier on the first chance", () => {
        squad.next(dataPointLong1);
        expect(squad.soldiers.length).toBe(1);
    });
    it("kills a soldier if the price falls below the stop loss", () => {
        squad.next(dataPointLong1); // deploy soldier at 100
        squad.next(dataPointLong2); // deploy soldier at 100, kill both soldiers at 93, stop loss price is 95
        expect(squad.soldiers.length).toBe(0);
        expect(squad.deadSoldiers.length).toBe(2);
    });
    it("extracts a soldier if the price rises above the exit price", () => {
        squad.next(dataPointLong1); // deploy soldier at 100
        squad.next(dataPointLong3); // deploy soldier at 100, extract both soldiers at 120, exit price is 120
        expect(squad.soldiers.length).toBe(0);
        expect(squad.extractedSoldiers.length).toBe(2);
    });
    it("keeps the soldier alive if the price stays within the stop loss and exit price", () => {
        squad.next(dataPointLong1);
        squad.next(dataPointLong1);
        expect(squad.soldiers.length).toBe(2);
    });
    it("increases the lifespan when it continues", () => {
        squad.next(dataPointLong1);
        squad.next(dataPointLong1);
        expect(squad.soldiers[0].lifeSpan).toBe(2); // first soldier lived for 2 intervals
        expect(squad.soldiers[1].lifeSpan).toBe(1); // second soldier lived for 1 interval
    });
    it("increases the wallet when it extracts", () => {
        squad.next(dataPointLong1); // deploy soldier at 100
        squad.next(dataPointLong3); // deploy soldier at 100, extract both soldiers at 120, exit price is 120
        expect(squad.wallet.baseBalance).toBe(1040);
    });
    it("restore the baseBalance of the wallet when soldier die", () => {
        squad.next(dataPointLong1); // deploy soldier at 100
        squad.next(dataPointLong2); // deploy soldier at 100, kill both soldiers at 93, stop loss price is 95
        expect(squad.wallet.baseBalance).toBe(990);
    });
    it("decreases the wallet when it deploys", () => {
        squad.next(dataPointLong1); //
        expect(squad.wallet.baseBalance).toBe(900);
    });
});
