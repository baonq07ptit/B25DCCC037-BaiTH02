export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast;
}

export interface WeatherInfo {
  description: string;
  icon: string;
  theme: "clear" | "cloudy" | "rainy" | "thunder";
}

export type TemperatureUnit = "C" | "F";

