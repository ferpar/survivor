export interface IWallet {
  quoteCurrency: string;
  baseCurrency: string;
  balance: number;
  quoteBalance: number;
  baseBalance: number;
  collateral: number;
  shortBalance: number;
  lastPrice: number;
  transactions: any[];
  buy(baseAmount: number, price: number, date: Date): void;
  sell(baseAmount: number, price: number, date: Date, entryPrice: number): void;
  short(baseAmount: number, price: number, date: Date): void;
  shortCover(
    baseAmount: number,
    price: number,
    date: Date,
    entryPrice: number,
    quoteAmount: number
  ): void;
  deposit(baseAmount: number, date: Date): void;
  withdraw(baseAmount: number, date: Date): void;
  updateLedger(date: Date, price?: number): void;
}

export interface IWalletConfig {
  quoteCurrency: string;
  baseCurrency: string;
  quoteAmount: number;
  baseAmount: number;
}
