/**
 * Comfort Index Algorithm
 *
 * Formula: CI = (0.4 × temp_score) + (0.25 × humidity_score) + (0.2 × wind_score) + (0.15 × visibility_score)
 *
 * Reasoning:
 * - Temperature (40%): Humans are most sensitive to temperature. Optimal range: 18-24°C
 * - Humidity (25%): Affects perceived temperature (comfort). Optimal range: 40-60%
 * - Wind Speed (20%): High winds cause discomfort. Optimal speed: 0-2 m/s
 * - Visibility (15%): Low visibility indicates poor weather. Optimal: 10000m+
 */

export interface WeatherData {
  name: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  description: string;
  icon: string;
  comfortIndex: number;
  rank?: number;
}

/**
 * Calculate comfort index for a city
 * Range: 0-100 (higher = more comfortable)
 */
export function calculateComfortIndex(data: {
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
}): number {
  // Temperature score (0-100): optimal 18-24°C
  const tempScore = calculateTempScore(data.temp);

  // Humidity score (0-100): optimal 40-60%
  const humidityScore = calculateHumidityScore(data.humidity);

  // Wind speed score (0-100): optimal 0-2 m/s
  const windScore = calculateWindScore(data.windSpeed);

  // Visibility score (0-100): optimal 10000m+
  const visibilityScore = calculateVisibilityScore(data.visibility);

  // Weighted formula
  const comfortIndex =
    tempScore * 0.4 +
    humidityScore * 0.25 +
    windScore * 0.2 +
    visibilityScore * 0.15;

  return Math.round(comfortIndex);
}

function calculateTempScore(temp: number): number {
  // Optimal: 18-24°C (score 100)
  // Acceptable: 15-27°C (score 80-90)
  // Tolerable: 0-35°C (score 10-80)
  // Extreme: <0 or >35°C (score < 10)

  if (temp >= 18 && temp <= 24) return 100;
  if (temp >= 16 && temp < 18) return 90 - (18 - temp) * 5;
  if (temp > 24 && temp <= 26) return 90 + (temp - 24) * 5;
  if (temp >= 10 && temp < 16) return 70 + (temp - 10) * 3.33;
  if (temp > 26 && temp <= 32) return 70 - (temp - 26) * 6.67;
  if (temp >= 5 && temp < 10) return 40 + (temp - 5) * 6;
  if (temp > 32) return Math.max(0, 10 - (temp - 32) * 2);
  if (temp >= 0 && temp < 5) return 20 + temp * 4;
  return Math.max(0, 20 - Math.abs(temp) * 2);
}

function calculateHumidityScore(humidity: number): number {
  // Optimal: 40-60% (score 100)
  // Acceptable: 30-70% (score 80-95)
  // Tolerable: 20-80% (score 50-80)

  if (humidity >= 40 && humidity <= 60) return 100;
  if (humidity >= 30 && humidity < 40)
    return 80 + (humidity - 30) * 2;
  if (humidity > 60 && humidity <= 70)
    return 95 - (humidity - 60) * 1.5;
  if (humidity >= 20 && humidity < 30)
    return 50 + (humidity - 20) * 3;
  if (humidity > 70 && humidity <= 80)
    return 50 + (80 - humidity) * 5;
  return Math.max(0, 30 - Math.abs(humidity - 50) * 0.5);
}

function calculateWindScore(windSpeed: number): number {
  // Optimal: 0-2 m/s (score 100)
  // Acceptable: 2-5 m/s (score 80-90)
  // Tolerable: 5-10 m/s (score 40-80)
  // Bad: >10 m/s (score < 40)

  if (windSpeed <= 2) return 100;
  if (windSpeed <= 5) return 100 - (windSpeed - 2) * 3.33;
  if (windSpeed <= 10) return 80 - (windSpeed - 5) * 8;
  return Math.max(0, 40 - (windSpeed - 10) * 2);
}

function calculateVisibilityScore(visibility: number): number {
  // Optimal: 10000m+ (score 100)
  // Acceptable: 5000-10000m (score 80-95)
  // Tolerable: 1000-5000m (score 40-80)
  // Poor: <1000m (score < 40)

  if (visibility >= 10000) return 100;
  if (visibility >= 5000) return 80 + (visibility - 5000) / 5000 * 20;
  if (visibility >= 1000) return 40 + (visibility - 1000) / 4000 * 40;
  return Math.max(0, (visibility / 1000) * 40);
}
