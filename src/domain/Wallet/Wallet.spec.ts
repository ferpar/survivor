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
});
