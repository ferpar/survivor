"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
class Wallet {
    constructor({ baseCurrency = "USD", quoteCurrency = "ETH", baseAmount = 0, quoteAmount = 0, }) {
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.balance = 0;
        this.baseBalance = baseAmount;
        this.quoteBalance = quoteAmount;
        this.transactions = [];
    }
    buy(baseAmount, price, date) {
        // notice to use this we specify the baseAmount and price
        // normally we would expect to work with the quoteAmount
        this.baseBalance -= baseAmount;
        this.quoteBalance += baseAmount / price;
        this.balance = this.baseBalance + this.quoteBalance * price;
        this.transactions.push({ type: "buy", baseAmount, price, date });
    }
    sell(baseAmount, price, date, entryPrice) {
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
    deposit(baseAmount, date) {
        // deposit base currency
        this.balance += baseAmount;
        this.baseBalance += baseAmount;
        this.transactions.push({ type: "deposit", baseAmount, date });
    }
    withdraw(baseAmount, date) {
        // withdraw base currency
        this.balance -= baseAmount;
        this.baseBalance -= baseAmount;
        this.transactions.push({ type: "withdraw", baseAmount, date });
    }
}
exports.Wallet = Wallet;
