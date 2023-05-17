import { IWallet, IWalletConfig } from "./Wallet.d";

export class Wallet implements IWallet {
  quoteCurrency: string;
  baseCurrency: string;
  balance: number;
  quoteBalance: number;
  baseBalance: number;
  collateral: number;
  shortBalance: number;
  lastPrice: number;
  transactions: any[];
  ledger: any[];

  constructor({
    quoteCurrency = "USD",
    baseCurrency = "ETH",
    quoteAmount = 0,
    baseAmount = 0,
  }: IWalletConfig) {
    this.quoteCurrency = quoteCurrency;
    this.baseCurrency = baseCurrency;
    this.balance = 0; // setting to zero while no transactions have been made (no price data)
    this.collateral = 0;
    this.quoteBalance = quoteAmount;
    this.baseBalance = baseAmount; // amount of base currency held
    this.shortBalance = 0; // amount of quote currency shorted, needs to be covered (repaid)
    this.lastPrice = 0;
    this.transactions = [];
    this.ledger = [];
  }

  init(price: number) {
    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(new Date(), price);
  }

  buy(quoteAmount: number, price: number, date: Date) {
    // notice to use this we specify the quoteAmount and price
    // normally we would expect to work with the baseAmount
    this.quoteBalance -= quoteAmount;
    this.baseBalance += quoteAmount / price;
    this.transactions.push({ type: "buy", quoteAmount, price, date });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  sell(quoteAmount: number, price: number, date: Date, entryPrice: number) {
    this.quoteBalance += quoteAmount;
    this.baseBalance -= quoteAmount / price;
    this.transactions.push({
      type: "sell",
      quoteAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  /**
   * @param {number} quoteAmount - The amount of quote currency to short
   * @param {number} price - The price of the base currency in quote currency
   * @param {Date} date - The date of the transaction
   * @returns {void}
   * */
  short(quoteAmount: number, price: number, date: Date): void {
    // update collateral in base currency
    this.collateral += quoteAmount;
    // update short balance in quote currency
    this.shortBalance += quoteAmount / price;
    this.transactions.push({ type: "short", quoteAmount, price, date });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  /**
   * @param {number} quoteAmount  - The amount of quote currency to short
   * @param {number} price - The price of the base currency in quote currency
   * @param {Date} date - The date of the transaction
   * @param {number} entryPrice - The price at which the short was opened
   */
  shortCover(
    quoteAmount: number,
    price: number,
    date: Date,
    entryPrice: number
  ) {
    // calculate profit in base currency
    const profit = (quoteAmount * (entryPrice - price)) / entryPrice;
    // update collateral in base currency (release collateral)
    this.collateral -= quoteAmount; // -= entryPrice ??
    // update short balance in quote currency (close out position)
    this.shortBalance -= quoteAmount / entryPrice;
    // update baseBalance in base currency (add profit) and balance in base currency
    this.quoteBalance += profit;
    this.balance = this.quoteBalance + this.baseBalance * price;

    this.transactions.push({
      type: "shortCover",
      quoteAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  deposit(quoteAmount: number, date: Date) {
    // deposit base currency
    this.balance += quoteAmount;
    this.quoteBalance += quoteAmount;
    this.transactions.push({ type: "deposit", quoteAmount, date });
    this.updateLedger(date);
  }

  withdraw(quoteAmount: number, date: Date) {
    // withdraw base currency
    this.balance -= quoteAmount;
    this.quoteBalance -= quoteAmount;
    this.transactions.push({ type: "withdraw", quoteAmount, date });
    this.ledger.push({
      quote: this.quoteBalance,
      base: this.baseBalance,
      price: null, // no price data
      balance: this.balance,
      date: date,
    });
    this.updateLedger(date);
  }

  updateLedger(date: Date, price?: number) {
    this.ledger.push({
      quote: this.quoteBalance,
      base: this.baseBalance,
      price: price ? price : null, // no price data
      balance: this.balance,
      date: date,
    });
  }
}
