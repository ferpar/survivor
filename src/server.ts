import express from "express";
import {
  getBacktestResults,
  getMarginHeatmap,
  getMarkets,
} from "./controllers";

const app = express();

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
);

app.get("/", async (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

app.get("/markets", async (req: express.Request, res: express.Response) => {
  const availableMarkets = await getMarkets();
  res.json(availableMarkets);
});

app.get("/backtest", async (req: express.Request, res: express.Response) => {
  const symbol = req.query.symbol;
  const period = req.query.period;
  const stop = req.query.stop;
  const limit = req.query.limit;
  const startTimestamp = req.query.startTimestamp;
  const endTimestamp = req.query.endTimestamp;
  const baseAmount = req.query.baseAmount;
  const quoteAmount = req.query.quoteAmount;
  const maxSoldiers = req.query.maxSoldiers;
  const amountPerSoldier = req.query.amountPerSoldier;
  const short = req.query.short;

  const testResults = await getBacktestResults({
    symbol: symbol && String(symbol),
    period: period && String(period),
    baseAmount: Number(baseAmount),
    quoteAmount: Number(quoteAmount),
    startTimestamp: Number(startTimestamp),
    endTimestamp: Number(endTimestamp),
    marginStop: Number(stop),
    marginLimit: Number(limit),
    maxSoldiers: Number(maxSoldiers),
    amountPerSoldier: Number(amountPerSoldier),
    short: "false" === short ? false : true,
  });

  res.json(testResults);
});

app.get(
  "/marginheatmap",
  async (req: express.Request, res: express.Response) => {
    const symbol = req.query.symbol;
    const period = req.query.period;
    const startTimestamp = req.query.startTimestamp;
    const endTimestamp = req.query.endTimestamp;
    const baseAmount = req.query.baseAmount;
    const quoteAmount = req.query.quoteAmount;
    const maxSoldiers = req.query.maxSoldiers;
    const amountPerSoldier = req.query.amountPerSoldier;
    const short = req.query.short;

    const marginHeatmap = await getMarginHeatmap({
      symbol: symbol && String(symbol),
      period: period && String(period),
      baseAmount: Number(baseAmount),
      quoteAmount: Number(quoteAmount),
      startTimestamp: Number(startTimestamp),
      endTimestamp: Number(endTimestamp),
      maxSoldiers: Number(maxSoldiers),
      amountPerSoldier: Number(amountPerSoldier),
      short: short === "false" ? false : true,
    });

    res.json(marginHeatmap);
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
