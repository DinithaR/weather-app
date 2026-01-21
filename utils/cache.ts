import NodeCache from 'node-cache';

/**
 * Cache manager for weather data
 * - Raw API responses: 5 minutes TTL
 * - Processed data: 5 minutes TTL
 */

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 minutes TTL

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hit: boolean;
}

export function getCachedData<T>(key: string): T | undefined {
  return cache.get(key);
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, data);
}

export function getCacheStatus() {
  return {
    keys: cache.keys(),
    stats: cache.getStats(),
  };
}

export function clearCache(): void {
  cache.flushAll();
}

export function isCacheHit(key: string): boolean {
  return cache.has(key);
}
