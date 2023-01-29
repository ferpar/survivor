export interface IWallet {
  baseCurrency: string;
  quoteCurrency: string;
  balance: number;
  baseBalance: number;
  quoteBalance: number;
  collateral: number;
  shortBalance: number;
  transactions: any[];
  buy(baseAmount: number, price: number, date: Date): void;
  sell(baseAmount: number, price: number, date: Date, entryPrice: number): void;
  short(baseAmount: number, price: number, date: Date): void;
  shortCover(
    baseAmount: number,
    price: number,
    date: Date,
    entryPrice: number
  ): void;
  deposit(baseAmount: number, date: Date): void;
  withdraw(baseAmount: number, date: Date): void;
}

export interface IWalletConfig {
  baseCurrency: string;
  quoteCurrency: string;
  baseAmount: number;
  quoteAmount: number;
}
