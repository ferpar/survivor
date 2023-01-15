class Soldier {
  constructor(
    amount,
    entryPrice,
    stopLossPercent,
    exitPricePercent,
    short = false
  ) {
    this.short = short;
    this.quoteAmount = amount / entryPrice;
    this.entryPrice = entryPrice;
    this.stopLoss = this.short
      ? entryPrice * (1 + stopLossPercent)
      : entryPrice * (1 - stopLossPercent);
    this.exitPrice = this.short
      ? entryPrice * (1 - exitPricePercent)
      : entryPrice * (1 + exitPricePercent);
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
      this.baseBalance = this.quoteAmount * close;
      if (this.short) {
        this.profitLoss = this.amount * (this.entryPrice - close);
      } else {
        this.profitLoss = this.amount * (close - this.entryPrice);
      }
    } else {
      this.baseBalance = this.alive
        ? this.quoteAmount * this.exitPrice
        : this.quoteAmount * this.stopLoss;
      if (this.short) {
        this.profitLoss = this.alive
          ? this.amount * (this.entryPrice - this.exitPrice)
          : this.amount * (this.entryPrice - this.stopLoss);
      } else {
        this.profitLoss = this.alive
          ? this.amount * (this.exitPrice - this.entryPrice)
          : this.amount * (this.stopLoss - this.entryPrice);
      }
    }
  }
}

module.exports = Soldier;
