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

  buy(amount: number, price: number, date: Date) {
    this.balance -= amount;
    this.baseBalance -= amount;
    this.quoteBalance += amount / price;
    this.transactions.push({ type: "buy", amount, price, date });
  }

  sell(amount: number, price: number, date: Date, entryPrice: number) {
    this.balance += amount;
    this.baseBalance += amount;
    this.quoteBalance -= amount / price;
    this.transactions.push({ type: "sell", amount, price, entryPrice, date });
  }

  deposit(amount: number, date: Date) {
    this.balance += amount;
    this.baseBalance += amount;
    this.transactions.push({ type: "deposit", amount, date });
  }

  withdraw(amount: number, date: Date) {
    this.balance -= amount;
    this.baseBalance -= amount;
    this.transactions.push({ type: "withdraw", amount, date });
  }
}
