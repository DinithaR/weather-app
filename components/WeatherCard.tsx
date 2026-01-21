'use client';

import { WeatherData } from '@/utils/comfortIndex';
import { getComfortColor, getComfortEmoji } from '@/utils/ui-helpers';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const comfortColor = getComfortColor(weather.comfortIndex);
  const emoji = getComfortEmoji(weather.comfortIndex);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{weather.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
        </div>
        <div className="text-4xl">{emoji}</div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-2xl font-semibold text-blue-600">
              {weather.temp}°C
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-2xl font-semibold text-blue-600">
              {weather.humidity}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-2xl font-semibold text-blue-600">
              {weather.windSpeed} m/s
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="text-2xl font-semibold text-blue-600">
              {(weather.visibility / 1000).toFixed(1)} km
            </p>
          </div>
        </div>

        <div className={`rounded-lg p-4 ${comfortColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">Comfort Index</p>
              <p className="text-3xl font-bold">{weather.comfortIndex}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-75">Rank</p>
              <p className="text-3xl font-bold">#{weather.rank}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
