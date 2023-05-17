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
    baseCurrency = "USD",
    quoteCurrency = "ETH",
    baseAmount = 0,
    quoteAmount = 0,
  }: IWalletConfig) {
    this.quoteCurrency = baseCurrency;
    this.baseCurrency = quoteCurrency;
    this.balance = 0; // setting to zero while no transactions have been made (no price data)
    this.collateral = 0;
    this.quoteBalance = baseAmount;
    this.baseBalance = quoteAmount; // amount of quote currency held
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

  buy(baseAmount: number, price: number, date: Date) {
    // notice to use this we specify the baseAmount and price
    // normally we would expect to work with the quoteAmount
    this.quoteBalance -= baseAmount;
    this.baseBalance += baseAmount / price;
    this.transactions.push({ type: "buy", baseAmount, price, date });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  sell(baseAmount: number, price: number, date: Date, entryPrice: number) {
    this.quoteBalance += baseAmount;
    this.baseBalance -= baseAmount / price;
    this.transactions.push({
      type: "sell",
      baseAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
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

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
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
    this.collateral -= baseAmount; // -= entryPrice ??
    // update short balance in quote currency (close out position)
    this.shortBalance -= baseAmount / entryPrice;
    // update baseBalance in base currency (add profit) and balance in base currency
    this.quoteBalance += profit;
    this.balance = this.quoteBalance + this.baseBalance * price;

    this.transactions.push({
      type: "shortCover",
      baseAmount,
      price,
      entryPrice,
      date,
    });

    this.balance = this.quoteBalance + this.baseBalance * price;
    this.lastPrice = price;
    this.updateLedger(date, price);
  }

  deposit(baseAmount: number, date: Date) {
    // deposit base currency
    this.balance += baseAmount;
    this.quoteBalance += baseAmount;
    this.transactions.push({ type: "deposit", baseAmount, date });
    this.updateLedger(date);
  }

  withdraw(baseAmount: number, date: Date) {
    // withdraw base currency
    this.balance -= baseAmount;
    this.quoteBalance -= baseAmount;
    this.transactions.push({ type: "withdraw", baseAmount, date });
    this.ledger.push({
      base: this.quoteBalance,
      quote: this.baseBalance,
      price: null, // no price data
      balance: this.balance,
      date: date,
    });
    this.updateLedger(date);
  }

  updateLedger(date: Date, price?: number) {
    this.ledger.push({
      base: this.quoteBalance,
      quote: this.baseBalance,
      price: price ? price : null, // no price data
      balance: this.balance,
      date: date,
    });
  }
}
