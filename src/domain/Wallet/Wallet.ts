import { IWallet, IWalletConfig } from "./Wallet.d";

export class Wallet implements IWallet {
  baseCurrency: string;
  quoteCurrency: string;
  balance: number;
  baseBalance: number;
  quoteBalance: number;
  collateral: number;
  shortBalance: number;
  lastPrice: number;
  transactions: any[];

  constructor({
    baseCurrency = "USD",
    quoteCurrency = "ETH",
    baseAmount = 0,
    quoteAmount = 0,
  }: IWalletConfig) {
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.balance = 0; // setting to zero while no transactions have been made (no price data)
    this.collateral = 0;
    this.baseBalance = baseAmount;
    this.quoteBalance = quoteAmount;
    this.shortBalance = 0;
    this.lastPrice = 0;
    this.transactions = [];
  }

  init(price: number) {
    this.balance = this.baseBalance + this.quoteBalance * price;
    this.lastPrice = price;
  }

  buy(baseAmount: number, price: number, date: Date) {
    // notice to use this we specify the baseAmount and price
    // normally we would expect to work with the quoteAmount
    this.baseBalance -= baseAmount;
    this.quoteBalance += baseAmount / price;
    this.transactions.push({ type: "buy", baseAmount, price, date });

    this.balance = this.baseBalance + this.quoteBalance * price;
    this.lastPrice = price;
  }

  sell(baseAmount: number, price: number, date: Date, entryPrice: number) {
    this.baseBalance += baseAmount;
    this.quoteBalance -= baseAmount / price;
    this.transactions.push({
      type: "sell",
      baseAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.baseBalance + this.quoteBalance * price;
    this.lastPrice = price;
  }

  /**
   * @param {number} baseAmount - The amount of base currency to short
   * @param {number} price - The price of the base currency in quote currency
   * @param {Date} date - The date of the transaction
   * @returns {void}
   * */
  short(baseAmount: number, price: number, date: Date): void {
    // update collateral in base currency
    this.collateral += baseAmount;
    // update short balance in quote currency
    this.shortBalance += baseAmount / price;
    this.transactions.push({ type: "short", baseAmount, price, date });

    this.balance = this.baseBalance + this.quoteBalance * price;
    this.lastPrice = price;
  }

  /**
   * @param {number} baseAmount  - The amount of base currency to short
   * @param {number} price - The price of the base currency in quote currency
   * @param {Date} date - The date of the transaction
   * @param {number} entryPrice - The price at which the short was opened
   */
  shortCover(
    baseAmount: number,
    price: number,
    date: Date,
    entryPrice: number
  ) {
    // calculate profit in base currency
    const profit = (baseAmount * (entryPrice - price)) / entryPrice;
    // update collateral in base currency (release collateral)
    this.collateral -= baseAmount;
    // update short balance in quote currency (close out position)
    this.shortBalance -= baseAmount / entryPrice;
    // update baseBalance in base currency (add profit) and balance in base currency
    this.baseBalance += profit;
    this.balance = this.baseBalance + this.quoteBalance * price;

    this.transactions.push({
      type: "shortCover",
      baseAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.baseBalance + this.quoteBalance * price;
    this.lastPrice = price;
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
