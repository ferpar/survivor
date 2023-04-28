import express from "express";
import { getBacktestResults, getMarginHeatmap } from "./controllers";

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

app.get("/backtest", async (req: express.Request, res: express.Response) => {
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
    baseAmount: Number(baseAmount),
    quoteAmount: Number(quoteAmount),
    startTimestamp: Number(startTimestamp),
    endTimestamp: Number(endTimestamp),
    marginStop: Number(stop),
    marginLimit: Number(limit),
    maxSoldiers: Number(maxSoldiers),
    amountPerSoldier: Number(amountPerSoldier),
    short: Boolean(short),
  });
  // an example url to test this route:
  /* http://localhost:3000/backtest
    ?stop=0.9&limit=1.1&startTimestamp=1449446400000&
    endTimestamp=1659225600000&baseAmount=1000&
    quoteAmount=0&maxSoldiers=10&
    amountPerSoldier=100&short=false */

  res.json(testResults);
});

// get endpoint for margin heatmap
app.get(
  "/marginheatmap",
  async (req: express.Request, res: express.Response) => {
    const startTimestamp = req.query.startTimestamp;
    const endTimestamp = req.query.endTimestamp;
    const baseAmount = req.query.baseAmount;
    const quoteAmount = req.query.quoteAmount;
    const maxSoldiers = req.query.maxSoldiers;
    const amountPerSoldier = req.query.amountPerSoldier;
    const short = req.query.short;

    console.log("short", short);
    console.log(Boolean(short));

    const marginHeatmap = await getMarginHeatmap({
      baseAmount: Number(baseAmount),
      quoteAmount: Number(quoteAmount),
      startTimestamp: Number(startTimestamp),
      endTimestamp: Number(endTimestamp),
      maxSoldiers: Number(maxSoldiers),
      amountPerSoldier: Number(amountPerSoldier),
      short: short === "false" ? false : true,
    });
    // an example url to test this route:
    /* http://localhost:3000/marginheatmap
    ?startTimestamp=1449446400000&endTimestamp=1659225600000&
    baseAmount=1000&quoteAmount=0&maxSoldiers=10&
    amountPerSoldier=100&short=false */

    res.json(marginHeatmap);
  }
);

// margin heatmap route
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
