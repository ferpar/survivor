class Soldier {
  constructor(amount, entryPrice, stopLoss, exitPrice, short = false) {
    this.amount = amount;
    this.entryPrice = entryPrice;
    this.stopLoss = stopLoss;
    this.exitPrice = exitPrice;
    this.short = short;
    this.alive = true;
    this.extracted = false;
    this.lifeSpan = 0;
    this.balance = null;
  }
  next(high, low, close) {
    // run the next simulation cycle
    if (this.alive && !this.extracted) {
      if (this.short) {
        if (high > this.stopLoss) {
          this.die(this.stopLoss);
        } else if (low < this.exitPrice) {
          this.extract(this.exitPrice);
        } else {
          this.continue(close)
        }
      } else {
        if (high > this.exitPrice) {
          this.extract(this.exitPrice);
        } else if (low < this.stopLoss) {
          this.die(this.stopLoss);
        } else {
          this.continue(close)
        }
      }
    } else return
  }

  extract(price) {
    this.extracted = true;
    this.setBalance(price);}

  die(price) {
    this.alive = false;
    this.setBalance(price);
  }

  continue(price) {
    this.setBalance(price);
    this.lifeSpan++;
  }

  setBalance(close) {
    if (this.alive && !this.extracted) {
      if (this.short) {
        this.balance = this.amount * (this.entryPrice - close));
      } else {
        this.balance = this.amount * (close - this.entryPrice);
      }
    }
  }
}
