import { RawDataPoint } from "../types/domain";

// parseFloat avoiding exponential notation

export function coinAPIToArray(marketData: any): RawDataPoint[] {
  const adaptedMarketData = marketData.map((datapoint: any) => {
    return [
      new Date(datapoint.time_period_start).getTime(),
      parseFloat(datapoint.price_open),
      parseFloat(datapoint.price_high),
      parseFloat(datapoint.price_low),
      parseFloat(datapoint.price_close),
      parseFloat(datapoint.volume_traded),
    ];
  });
  return adaptedMarketData;
}
