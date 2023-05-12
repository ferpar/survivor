const ccxt = require("ccxt");

async function getExchangeKYCRequirements(exchangeId) {
  try {
    const exchange = new ccxt[exchangeId]();
    await exchange.loadMarkets();

    console.log(`Exchange: ${exchangeId}`);
    console.log(
      `KYC Requirements: ${JSON.stringify(exchange.requiredCredentials)}`
    );
  } catch (error) {
    console.error("Error retrieving exchange information:", error);
  }
}

// Get available exchanges
async function getExchanges() {
  try {
    const exchanges = await ccxt.exchanges;
    console.log(`Exchanges: ${exchanges}`);
  } catch (error) {
    console.error("Error retrieving exchanges:", error);
  }
}

//Exchanges retrieved from ccxt.exchanges

const Exchanges = [
  ace,
  alpaca,
  ascendex,
  bequant,
  bigone,
  binance,
  binancecoinm,
  binanceus,
  binanceusdm,
  bit2c,
  bitbank,
  bitbay,
  bitbns,
  bitcoincom,
  bitfinex,
  bitfinex2,
  bitflyer,
  bitforex,
  bitget,
  bithumb,
  bitmart,
  bitmex,
  bitopro,
  bitpanda,
  bitrue,
  bitso,
  bitstamp,
  bitstamp1,
  bittrex,
  bitvavo,
  bkex,
  bl3p,
  blockchaincom,
  btcalpha,
  btcbox,
  btcex,
  btcmarkets,
  btctradeua,
  btcturk,
  bybit,
  cex,
  coinbase,
  coinbaseprime,
  coinbasepro,
  coincheck,
  coinex,
  coinfalcon,
  coinmate,
  coinone,
  coinsph,
  coinspot,
  cryptocom,
  currencycom,
  delta,
  deribit,
  digifinex,
  exmo,
  fmfwio,
  gate,
  gateio,
  gemini,
  hitbtc,
  hitbtc3,
  hollaex,
  huobi,
  huobijp,
  huobipro,
  idex,
  independentreserve,
  indodax,
  kraken,
  krakenfutures,
  kucoin,
  kucoinfutures,
  kuna,
  latoken,
  lbank,
  lbank2,
  luno,
  lykke,
  mercado,
  mexc,
  mexc3,
  ndax,
  novadax,
  oceanex,
  okcoin,
  okex,
  okex5,
  okx,
  paymium,
  phemex,
  poloniex,
  poloniexfutures,
  probit,
  stex,
  tidex,
  timex,
  tokocrypto,
  upbit,
  wavesexchange,
  wazirx,
  whitebit,
  woo,
  xt,
  yobit,
  zaif,
  zonda,
];

getExchangeKYCRequirements("bybit");

// getExchanges();
