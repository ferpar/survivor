"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Soldier = void 0;
class Soldier {
    constructor({ amount, entryPrice, stopLossPercent, exitPricePercent, }) {
        this.quoteAmount = amount / entryPrice;
        this.entryPrice = entryPrice;
        this.stopLoss = entryPrice * (1 - stopLossPercent);
        this.exitPrice = entryPrice * (1 + exitPricePercent);
        this.alive = true;
        this.diedAt = null;
        this.extracted = false;
        this.extractedAt = null;
        this.lifeSpan = 0;
        this.balance = amount;
        this.profitLoss = 0;
    }
    next(dataPoint) {
        const { date, high, low, close } = dataPoint;
        // run the next simulation cycle
        if (this.alive && !this.extracted) {
            if (high >= this.exitPrice) {
                this.extract(this.exitPrice, date);
            }
            else if (low <= this.stopLoss) {
                this.die(this.stopLoss, date);
            }
            else {
                this.continue(close);
            }
        }
        else
            return;
    }
    extract(price, date) {
        this.extracted = true;
        this.extractedAt = date;
        this.updateBalance(price);
    }
    die(price, date) {
        this.alive = false;
        this.diedAt = date;
        this.updateBalance(price);
    }
    continue(price) {
        this.updateBalance(price);
        this.lifeSpan++;
    }
    updateBalance(close) {
        if (this.alive && !this.extracted) {
            // if the soldier is continuing to fight
            this.balance = this.quoteAmount * close;
            this.profitLoss = this.quoteAmount * (close - this.entryPrice);
        }
        else {
            // if the soldier is dead or has extracted
            this.balance = this.alive
                ? this.quoteAmount * this.exitPrice
                : this.quoteAmount * this.stopLoss;
            this.profitLoss = this.alive
                ? this.quoteAmount * (this.exitPrice - this.entryPrice)
                : this.quoteAmount * (this.stopLoss - this.entryPrice);
        }
    }
}
exports.Soldier = Soldier;
