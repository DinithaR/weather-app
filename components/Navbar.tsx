'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { TiWeatherCloudy } from 'react-icons/ti';

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="bg-linear-to-r from-blue-500 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TiWeatherCloudy className='text-3xl mt-1 text-white' />
              <span className="text-white text-xl font-bold">WeatherApp</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Home
              </Link>
              <Link
                href="/forecast"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Forecast
              </Link>
              <Link
                href="/favorites"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Favorites
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="text-white">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm hidden sm:block">
                  {user.name || user.email}
                </span>
                <a
                  href="/api/auth/logout"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:bg-blue-700 p-2 rounded-md"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
