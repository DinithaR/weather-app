import { NextResponse } from 'next/server';
import { getCacheStatus, clearCache } from '@/utils/cache';

export async function GET() {
  const cacheStatus = getCacheStatus();
  return NextResponse.json({
    status: 'Cache Status',
    keys: cacheStatus.keys,
    stats: cacheStatus.stats,
  });
}

export async function DELETE() {
  clearCache();
  return NextResponse.json({ message: 'Cache cleared' });
}
