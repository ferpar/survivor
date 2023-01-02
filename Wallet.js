class Wallet {
  constructor(baseCurrency = "usd", quoteCurrency = "eth") {
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.balance = 0;
    this.baseBalance = 0;
    this.quoteBalance = 0;
    this.transactions = [];
  }

  buy(amount, price, date) {
    this.balance -= amount;
    this.baseBalance -= amount;
    this.quoteBalance += amount / price;
    this.transactions.push({ type: "buy", amount, price, date });
  }

  sell(amount, price, date, entryPrice) {
    this.balance += amount;
    this.baseBalance += amount;
    this.quoteBalance -= amount / price;
    this.transactions.push({ type: "sell", amount, price, entryPrice, date });
  }

  deposit(amount, date) {
    this.balance += amount;
    this.baseBalance += amount;
    this.transactions.push({ type: "deposit", amount, date });
  }

  withdraw(amount, date) {
    this.balance -= amount;
    this.baseBalance -= amount;
    this.transactions.push({ type: "withdraw", amount, date });
  }
}

module.exports = Wallet;
