import type { City, WeatherApiResponse, WeatherInfo, TemperatureUnit } from "../types";

export const CITIES: City[] = [
  { id: "hanoi", name: "Hà Nội", latitude: 21.0285, longitude: 105.8542 },
  { id: "haiphong", name: "Hải Phòng", latitude: 20.8449, longitude: 106.6881 },
  { id: "hue", name: "Huế", latitude: 16.4637, longitude: 107.5909 },
  { id: "danang", name: "Đà Nẵng", latitude: 16.0544, longitude: 108.2022 },
  { id: "nhatrang", name: "Nha Trang", latitude: 12.2388, longitude: 109.1967 },
  { id: "dalat", name: "Đà Lạt", latitude: 11.9404, longitude: 108.4583 },
  { id: "hcm", name: "TP. Hồ Chí Minh", latitude: 10.8231, longitude: 106.6297 },
  { id: "cantho", name: "Cần Thơ", latitude: 10.0452, longitude: 105.7469 },
];

const FAVORITES_KEY = "weather_favorite_cities";

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherApiResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gọi API thất bại (mã ${res.status}). Vui lòng kiểm tra lại kết nối mạng.`);
  }
  return res.json();
}

/**
 * Tra cứu mã thời tiết theo WMO Weather interpretation codes
 */
export function getWeatherInfo(code: number): WeatherInfo {
  switch (code) {
    case 0:
      return { description: "Trời quang đãng", icon: "☀️", theme: "clear" };
    case 1:
      return { description: "Trời hầu như không mây", icon: "🌤️", theme: "clear" };
    case 2:
      return { description: "Mây rải rác", icon: "⛅", theme: "cloudy" };
    case 3:
      return { description: "Nhiều mây u ám", icon: "☁️", theme: "cloudy" };
    case 45:
    case 48:
      return { description: "Có sương mù", icon: "🌫️", theme: "cloudy" };
    case 51:
    case 53:
    case 55:
      return { description: "Mưa phùn rải rác", icon: "🌦️", theme: "rainy" };
    case 61:
      return { description: "Mưa rào nhẹ", icon: "🌧️", theme: "rainy" };
    case 63:
      return { description: "Mưa vừa", icon: "🌧️", theme: "rainy" };
    case 65:
      return { description: "Mưa to, mưa lớn", icon: "🌧️", theme: "rainy" };
    case 80:
    case 81:
    case 82:
      return { description: "Mưa rào từng đợt", icon: "🌦️", theme: "rainy" };
    case 95:
      return { description: "Có dông sét", icon: "⛈️", theme: "thunder" };
    case 96:
    case 99:
      return { description: "Dông bão kèm mưa đá", icon: "⛈️", theme: "thunder" };
    default:
      if (code >= 60 && code <= 69) {
        return { description: "Mưa", icon: "🌧️", theme: "rainy" };
      }
      return { description: "Có mây", icon: "⛅", theme: "cloudy" };
  }
}

/**
 * Đổi nhiệt độ °C sang °F theo công thức toán học, không gọi lại API
 */
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === "F") {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Định dạng thứ trong tuần bằng tiếng Việt
 */
export function formatWeekday(dateStr: string, index = 0): string {
  if (index === 0) return "Hôm nay";
  const date = new Date(dateStr);
  const day = date.getDay();
  const weekdays = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return weekdays[day] || "Thứ";
}

/**
 * Định dạng ngày/tháng (DD/MM)
 */
export function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

/**
 * Định dạng giờ và ngày từ chuỗi ISO (VD: 2026-10-28T14:30 -> 14:30 - 28/10/2026)
 */
export function formatDateTime(isoStr: string): string {
  try {
    const [datePart, timePart] = isoStr.split("T");
    const [year, month, day] = datePart.split("-");
    const time = timePart ? timePart.slice(0, 5) : "";
    return `${time ? time + " - " : ""}${day}/${month}/${year}`;
  } catch {
    return isoStr;
  }
}

/**
 * Chuẩn hóa chuỗi tiếng Việt để tìm kiếm không phân biệt hoa thường và dấu
 */
export function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/**
 * Quản lý danh sách thành phố yêu thích lưu trong localStorage
 */
export function getFavoriteCityIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteCityIds(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Bỏ qua nếu localStorage bị đầy
  }
}

