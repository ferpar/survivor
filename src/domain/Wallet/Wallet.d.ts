export interface IWallet {
  baseCurrency: string;
  quoteCurrency: string;
  balance: number;
  baseBalance: number;
  quoteBalance: number;
  buy(amount: number, price: number, date: Date): void;
  sell(amount: number, price: number, date: Date, entryPrice: number): void;
  deposit(amount: number, date: Date): void;
  withdraw(amount: number, date: Date): void;
}

export interface IWalletConfig {
  baseCurrency: string;
  quoteCurrency: string;
  baseAmount: number;
  quoteAmount: number;
}
