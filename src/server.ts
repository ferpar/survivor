import express from "express";

const app = express();

app.get("/", async (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

app.get("/backtest", async (req: express.Request, res: express.Response) => {
  const stop = req.query.stop;
  const limit = req.query.limit;
  const startTimestamp = req.query.startTimestamp;
  const endTimestamp = req.query.endTimestamp;

  const testResults = await getBacktestResults(
    stop,
    limit,
    startTimestamp,
    endTimestamp
  );

  res.json(testResults);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
