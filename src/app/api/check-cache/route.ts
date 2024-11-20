import { NextResponse } from 'next/server';
import { CacheManager } from '@/lib/cache-manager';
import { SearchParams } from '@/types/cache';

export async function POST(request: Request) {
  try {
    const { city, state, filters, lat, lng, results } = await request.json();

    if (!city || !state) {
      return NextResponse.json(
        { error: 'City and state are required' }, 
        { status: 400 }
      );
    }

    const searchParams: SearchParams = {
      city,
      state,
      lat,
      lng,
      filters
    };

    const cacheManager = new CacheManager();

    if (results) {
      cacheManager.setCache(searchParams, results);
      return NextResponse.json({
        message: 'Results cached successfully',
        hasCache: true,
        results,
        timestamp: new Date().toISOString()
      });
    }

    const cacheEntry = cacheManager.getCache(searchParams);
    
    if (cacheEntry) {
      return NextResponse.json({
        hasCache: true,
        results: cacheEntry.results,
        timestamp: cacheEntry.timestamp
      });
    }

    return NextResponse.json({ hasCache: false });

  } catch (error) {
    console.error('Cache operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform cache operation' }, 
      { status: 500 }
    );
  }
}