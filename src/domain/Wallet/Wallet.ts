import { IWallet, IWalletConfig } from "./Wallet.d";

export class Wallet implements IWallet {
  baseCurrency: string;
  quoteCurrency: string;
  balance: number;
  baseBalance: number;
  quoteBalance: number;
  transactions: any[];

  constructor({
    baseCurrency = "USD",
    quoteCurrency = "ETH",
    baseAmount = 0,
    quoteAmount = 0,
  }: IWalletConfig) {
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.balance = 0;
    this.baseBalance = baseAmount;
    this.quoteBalance = quoteAmount;
    this.transactions = [];
  }

  buy(baseAmount: number, price: number, date: Date) {
    // notice to use this we specify the baseAmount and price
    // normally we would expect to work with the quoteAmount
    this.baseBalance -= baseAmount;
    this.quoteBalance += baseAmount / price;
    this.balance = this.baseBalance + this.quoteBalance * price;
    this.transactions.push({ type: "buy", baseAmount, price, date });
  }

  sell(baseAmount: number, price: number, date: Date, entryPrice: number) {
    this.baseBalance += baseAmount;
    this.quoteBalance -= baseAmount / price;
    this.balance = this.baseBalance + this.quoteBalance * price;
    this.transactions.push({
      type: "sell",
      baseAmount,
      price,
      entryPrice,
      date,
    });
  }

  deposit(baseAmount: number, date: Date) {
    // deposit base currency
    this.balance += baseAmount;
    this.baseBalance += baseAmount;
    this.transactions.push({ type: "deposit", baseAmount, date });
  }

  withdraw(baseAmount: number, date: Date) {
    // withdraw base currency
    this.balance -= baseAmount;
    this.baseBalance -= baseAmount;
    this.transactions.push({ type: "withdraw", baseAmount, date });
  }
}
