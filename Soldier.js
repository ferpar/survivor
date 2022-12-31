class Soldier {
  constructor(amount, entryPrice, stopLoss, exitPrice, short = false) {
    this.quoteAmount = amount / entryPrice;
    this.entryPrice = entryPrice;
    this.stopLoss = stopLoss;
    this.exitPrice = exitPrice;
    this.short = short;
    this.alive = true;
    this.diedAt = null;
    this.extracted = false;
    this.extractedAt = null;
    this.lifeSpan = 0;
    this.baseBalance = null;
    this.profitLoss = null;
  }
  next(high, low, close, date) {
    // run the next simulation cycle
    if (this.alive && !this.extracted) {
      if (this.short) {
        if (high > this.stopLoss) {
          this.die(this.stopLoss, date);
        } else if (low < this.exitPrice) {
          this.extract(this.exitPrice, date);
        } else {
          this.continue(close);
        }
      } else {
        if (high > this.exitPrice) {
          this.extract(this.exitPrice, date);
        } else if (low < this.stopLoss) {
          this.die(this.stopLoss, date);
        } else {
          this.continue(close);
        }
      }
    } else return;
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
      if (this.short) {
        this.baseBalance = this.quoteAmount * close;
        this.profitLoss = this.amount * (this.entryPrice - close);
      } else {
        this.baseBalance = this.quoteAmount * close;
        this.profitLoss = this.amount * (close - this.entryPrice);
      }
    } else {
      if (this.short) {
        this.baseBalance = this.quoteAmount * this.exitPrice;
        this.profitLoss = this.amount * (this.entryPrice - this.exitPrice);
      } else {
        this.baseBalance = this.quoteAmount * this.exitPrice;
        this.profitLoss = this.amount * (this.exitPrice - this.entryPrice);
      }
    }
  }
}

module.exports = Soldier;
