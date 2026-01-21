'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { TiWeatherCloudy } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on link click
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/forecast', label: 'Forecast' },
    { href: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl' 
          : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group cursor-pointer"
              title="Weather App Home"
            >
              <div className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
                <TiWeatherCloudy className="text-3xl text-white" />
              </div>
              <span className="text-white text-xl font-bold hidden sm:inline bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                WeatherApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
                <div className="w-20 h-2 rounded bg-white/20 animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-white/30">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name || 'User avatar'}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-lg hover:shadow-xl transition-shadow duration-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-white">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-white text-sm font-medium truncate max-w-[150px]">
                    {user.name || user.email}
                  </div>
                </div>
                <a
                  href="/auth/logout"
                  className="bg-white/90 hover:bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Sign In
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <MdClose className="w-6 h-6 text-white" />
            ) : (
              <MdMenu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:bg-white/20 block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-white/30">
              {isLoading ? (
                <div className="px-4 py-3 space-y-2">
                  <div className="h-4 bg-white/20 rounded animate-pulse" />
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="px-4 py-3 flex items-center space-x-3">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || 'User avatar'}
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-white text-sm">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {user.name || user.email}
                      </p>
                    </div>
                  </div>
                  <a
                    href="/auth/logout"
                    className="mx-4 block bg-white/90 hover:bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-center active:scale-95"
                    onClick={closeMobileMenu}
                  >
                    Logout
                  </a>
                </div>
              ) : (
                <a
                  href="/auth/login"
                  className="block bg-white text-blue-600 hover:bg-blue-50 mx-4 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 text-center active:scale-95"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
