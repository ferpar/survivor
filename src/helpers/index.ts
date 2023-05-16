import { RawDataPoint } from "../types/domain";

export function coinAPIToArray(marketData: any): RawDataPoint[] {
  const adaptedMarketData = marketData.map((datapoint: any) => {
    return [
      new Date(datapoint.time_period_start).getTime(),
      datapoint.price_open,
      datapoint.price_high,
      datapoint.price_low,
      datapoint.price_close,
      datapoint.volume_traded,
    ];
  });
  return adaptedMarketData;
}
