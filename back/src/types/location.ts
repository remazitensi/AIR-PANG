import { RowDataPacket } from 'mysql2';

export interface AnnualData extends RowDataPacket {
  location_id: number;
  pm10_avg: number;
  pm25_avg: number;
  o3_avg: number;
  no2_avg: number;
  co_avg: number;
  so2_avg: number;
  address_b_name: string;
}

export interface RealtimeData extends RowDataPacket {
  location_id: number;
  pm10: number;
  pm25: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
  address_b_name: string;
}

export interface MonthlyData {
  locations: {
    id: number;
    address_a_name: string;
    address_b_name: string;
  };
  Realtime_Air_Quality: {
    pm10: number;
    pm25: number;
    o3: number;
    no2: number;
    co: number;
    so2: number;
    aqi: number;
  };
  monthly_aqi: {
    month: string;
    aqi: number;
  }[];
}

export interface AirQualityItem {
  cityName: string;
  pm10Value: number | null;
  pm25Value: number | null;
  o3Value: number | null;
  no2Value: number | null;
  coValue: number | null;
  so2Value: number | null;
  dataTime: string;
}
