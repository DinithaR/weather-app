'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherData } from '@/utils/comfortIndex';

export default function Home() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheHit, setCacheHit] = useState(false);
  const [sortBy, setSortBy] = useState<'comfort' | 'temp' | 'name'>('comfort');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch weather data if user is authenticated
    if (!user) return;

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const result = await response.json();
        setWeatherData(result.data);
        setCacheHit(result.cacheHit);
        if (result.timestamp) {
          setLastUpdated(new Date(result.timestamp).toLocaleTimeString());
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [user]);

  const getSortedData = () => {
    const data = [...weatherData];
    switch (sortBy) {
      case 'comfort':
        return data.sort((a, b) => b.comfortIndex - a.comfortIndex);
      case 'temp':
        return data.sort((a, b) => b.temp - a.temp);
      case 'name':
        return data.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return data;
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect is in progress)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Weather Comfort Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Discover the most comfortable cities based on weather conditions
          </p>
          {cacheHit && (
            <div className="mt-3 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
              ✓ Cached data (updated every 5 minutes)
            </div>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="mb-6 flex flex-wrap gap-2 sm:gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <button
            onClick={() => setSortBy('comfort')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'comfort'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Comfort Score
          </button>
          <button
            onClick={() => setSortBy('temp')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'temp'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            City Name
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : weatherData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No weather data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedData().map((weather) => (
              <WeatherCard key={weather.name} weather={weather} />
            ))}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <details className="cursor-pointer">
            <summary className="font-semibold text-gray-700 hover:text-gray-900">
              Debug Information
            </summary>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>Cities processed: {weatherData.length}</p>
              <p>Cache status: {cacheHit ? 'HIT (5 min TTL)' : 'MISS'}</p>
              <p>Last updated: {lastUpdated}</p>
            </div>
          </details>
        </div>
      </main>
    </div>
  );
}
