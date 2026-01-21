import { NextResponse } from 'next/server';
import { calculateComfortIndex, WeatherData } from '@/utils/comfortIndex';
import { getCachedData, setCachedData } from '@/utils/cache';
import citiesData from '@/cities.json';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '8560a50a1d99c4c36658440a2c124550';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export async function GET() {
  try {
    const cacheKey = 'weather_data_all_cities';
    
    // Check cache first
    const cachedData = getCachedData<{
      data: WeatherData[];
      timestamp: number;
      cacheHit: boolean;
    }>(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        cacheHit: true,
      });
    }

    // Fetch weather data for all cities
    const weatherDataPromises = citiesData.List.map((city) =>
      fetch(
        `${BASE_URL}?id=${city.CityCode}&units=metric&appid=${API_KEY}`
      )
        .then((res) => res.json() as Promise<OpenWeatherResponse>)
        .then((data) => ({
          name: data.name,
          temp: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          visibility: data.visibility,
          description: data.weather[0]?.description || 'N/A',
          icon: data.weather[0]?.icon || '01d',
        }))
        .catch((err) => {
          console.error(`Error fetching data for ${city.CityName}:`, err);
          return null;
        })
    );

    const rawWeatherData = await Promise.all(weatherDataPromises);
    
    // Filter out failed requests
    const validWeatherData = rawWeatherData.filter(
      (data): data is Omit<WeatherData, 'comfortIndex' | 'rank'> => data !== null
    );

    // Calculate comfort index for each city
    const weatherWithComfort: WeatherData[] = validWeatherData.map((data) => ({
      ...data,
      comfortIndex: calculateComfortIndex({
        temp: data.temp,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        visibility: data.visibility,
      }),
    }));

    // Sort by comfort index (highest first)
    const sortedByComfort = weatherWithComfort.sort(
      (a, b) => b.comfortIndex - a.comfortIndex
    );

    // Add ranks
    const rankedData: WeatherData[] = sortedByComfort.map((data, index) => ({
      ...data,
      rank: index + 1,
    }));

    const responseData = {
      data: rankedData,
      timestamp: Date.now(),
      cacheHit: false,
    };

    // Cache the result
    setCachedData(cacheKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
