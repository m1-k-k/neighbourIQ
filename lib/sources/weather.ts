import "server-only";
import { WeatherForecast } from "../types";

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function conditionFromCode(code: number): string {
  return WEATHER_CODE_MAP[code] ?? "Unknown conditions";
}

function alertTypeFor(code: number, windKmh: number, rainfall24hMm: number, tempC: number): WeatherForecast["alertType"] {
  if (rainfall24hMm >= 50 || code >= 95) return "flood";
  if (windKmh >= 45 || (code >= 80 && code <= 82)) return "storm";
  if (tempC <= -2) return "extreme-cold";
  if (tempC >= 32) return "heat";
  return "none";
}

export interface WeatherResult extends WeatherForecast {
  rainfall24hMm: number;
}

export async function fetchWeather(center: { lat: number; lon: number }): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lon}&current=temperature_2m,wind_speed_10m,precipitation,weather_code&hourly=precipitation&past_days=1&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
  const body = await res.json();

  const current = body?.current ?? {};
  const hourlyTimes: string[] = body?.hourly?.time ?? [];
  const hourlyPrecip: number[] = body?.hourly?.precipitation ?? [];

  let rainfall24hMm: number;
  const currentIndex = hourlyTimes.indexOf(current.time);
  if (currentIndex >= 0) {
    const start = Math.max(0, currentIndex - 23);
    rainfall24hMm = hourlyPrecip.slice(start, currentIndex + 1).reduce((sum, v) => sum + (v ?? 0), 0);
  } else {
    rainfall24hMm = hourlyPrecip.slice(-24).reduce((sum, v) => sum + (v ?? 0), 0);
  }

  const tempC = current.temperature_2m ?? 12;
  const windKmh = Math.round(current.wind_speed_10m ?? 0);
  const code = current.weather_code ?? 0;

  return {
    condition: conditionFromCode(code),
    tempC: Math.round(tempC),
    windKmh,
    rainfallMm: Math.round((current.precipitation ?? 0) * 10) / 10,
    alertType: alertTypeFor(code, windKmh, rainfall24hMm, tempC),
    rainfall24hMm: Math.round(rainfall24hMm * 10) / 10,
  };
}
