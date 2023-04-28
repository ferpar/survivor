import { Wallet } from "./Wallet";
import { IWalletConfig } from "./Wallet.d";

const walletConfig: IWalletConfig = {
  baseCurrency: "USD",
  quoteCurrency: "ETH",
  baseAmount: 1000,
  quoteAmount: 3.5,
};

let wallet: Wallet;
beforeEach(() => {
  wallet = new Wallet(walletConfig);
});

describe("Wallet", () => {
  it("has an initial balance of 0", () => {
    expect(wallet.balance).toEqual(0);
  });
  it("should have a base balance of 1000", () => {
    expect(wallet.baseBalance).toEqual(1000);
  });
  it("should have a quote balance of 0", () => {
    expect(wallet.quoteBalance).toEqual(3.5);
  });
  it("should have a base currency of USD", () => {
    expect(wallet.baseCurrency).toEqual("USD");
  });
  it("should have a quote currency of ETH", () => {
    expect(wallet.quoteCurrency).toEqual("ETH");
  });
  it("should have a balance of 1350 after spending 1000 USD on ETH at 100 USD per ETH", () => {
    wallet.buy(1000, 100, new Date());
    expect(wallet.balance).toEqual(1350);
  });
  it("should have a balance of 1350 after buying 5 ETH at 100 USD each", () => {
    wallet.buy(500, 100, new Date());
    expect(wallet.balance).toEqual(1350);
  });
  it("should have a quoteBalance of 8.5 after buying 5 ETH at 100 USD each", () => {
    wallet.buy(500, 100, new Date());
    expect(wallet.quoteBalance).toEqual(8.5);
  });
  it("should have a baseBalance of 500 after buying 5 ETH at 100 USD each", () => {
    wallet.buy(500, 100, new Date());
    expect(wallet.baseBalance).toEqual(500);
  });
  it("should have a balance of 1350 after buying 5 ETH at 100 USD each and then buying 5 ETH at 100 USD each", () => {
    wallet.buy(500, 100, new Date());
    wallet.buy(500, 100, new Date());
    expect(wallet.balance).toEqual(1350);
  });
  it("should have a balance of 1520 after buying 5 ETH at 100 USD each and then 5 ETH at 120 USD each", () => {
    wallet.buy(500, 100, new Date());
    wallet.sell(600, 120, new Date(), 100);
    // 500 USD baseBalance + 600 USD from sale + 3.5 ETH quoteBalance * 120 USD = 1520 USD
    expect(wallet.balance).toEqual(1520);
  });
  it("should have a baseBalance of 1100 after depositing 100 USD", () => {
    wallet.deposit(100, new Date());
    expect(wallet.baseBalance).toEqual(1100);
  });
  it("should have a baseBalance of 900 after withdrawing 100 USD", () => {
    wallet.withdraw(100, new Date());
    expect(wallet.baseBalance).toEqual(900);
  });
  it("should have a baseBalance of 1200 after withdrawing 500 and depositing 700 USD", () => {
    wallet.withdraw(500, new Date());
    wallet.deposit(700, new Date());
    expect(wallet.baseBalance).toEqual(1200);
  });
  it("should have a balance of 1450 after buying 5 ETH at 100 USD each and then depositing 100 USD", () => {
    wallet.buy(500, 100, new Date());
    wallet.deposit(100, new Date());
    expect(wallet.balance).toEqual(1450);
  });
  it("should add no quoteBalance after a short sell of 5 ETH at 100 USD each", () => {
    const priorBalance = wallet.quoteBalance;
    wallet.short(500, 100, new Date());
    expect(wallet.quoteBalance).toEqual(priorBalance);
  });
  it("should add 5 ETH to shortBalance after a short sell of 5 ETH at 100 USD each", () => {
    const priorBalance = wallet.shortBalance;
    wallet.short(500, 100, new Date());
    expect(wallet.shortBalance).toEqual(priorBalance + 5);
  });
  it("should not modify the baseBalance after a short sell of 5 ETH at 100 USD each", () => {
    const priorBalance = wallet.baseBalance;
    wallet.short(500, 100, new Date());
    expect(wallet.baseBalance).toEqual(priorBalance);
  });
  it("should have the same balance after a short sell of 5 ETH at 100 USD each", () => {
    wallet.init(100);
    const priorBalance = wallet.balance;
    wallet.short(500, 100, new Date());
    expect(wallet.balance).toEqual(priorBalance);
  });
  it("should increase the balance after a short sell of 5 ETH at 100 USD each, and a shortCover of 5 ETH at 80 USD each", () => {
    wallet.init(100);
    const priorBalance = wallet.balance;
    wallet.short(500, 100, new Date());
    wallet.shortCover(500, 80, new Date(), 100);
    wallet.init(100);
    expect(wallet.balance).toBeGreaterThan(priorBalance);
  });
  it("if the wallet also holds quote, its depreciation should also be factored into the balance", () => {
    wallet.init(100);
    const priorBalance = wallet.balance;
    wallet.short(500, 100, new Date());
    wallet.shortCover(500, 80, new Date(), 100);
    const profit = (500 * (100 - 80)) / 100;
    const depreciation = wallet.quoteBalance * 20;
    expect(wallet.balance).toEqual(priorBalance + profit - depreciation);
  });
  it("should decrease the balance after a short sell of 5 ETH at 100 USD each, and a shortCover of 5 ETH at 105 USD each", () => {
    wallet.init(100);
    const priorBalance = wallet.balance;
    wallet.short(500, 100, new Date());
    wallet.shortCover(500, 105, new Date(), 100);
    expect(wallet.balance).toBeLessThan(priorBalance);
  });
});
