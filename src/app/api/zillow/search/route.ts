// src/app/api/zillow/search/route.ts
import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { CacheManager } from '@/lib/cache-manager';
import { ZillowProperty, SearchFilters } from '@/types/property';
import { SearchParams } from '@/types/cache';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN || '',
});

let isProcessing = false;
let lastRequestTime = 0;
let cachedResults: ZillowProperty[] | null = null;
const LOCK_DURATION = 5000;

interface SearchUrlRequest {
    url: string;
    filters?: SearchFilters;
}

const fetchProperties = async (searchUrl: string): Promise<ZillowProperty[]> => {
    const now = Date.now();
    
    if (now - lastRequestTime < LOCK_DURATION && cachedResults) {
        console.log('Returning cached results within lock period');
        return cachedResults;
    }

    if (isProcessing) {
        console.log('Request already in progress, returning cached or empty results');
        return cachedResults || [];
    }

    try {
        isProcessing = true;
        lastRequestTime = now;

        const urlParams = new URL(searchUrl).searchParams;
        const searchQueryStateStr = urlParams.get('searchQueryState');
        let searchQueryState = searchQueryStateStr ? JSON.parse(decodeURIComponent(searchQueryStateStr)) : {};
        
        const bounds = searchQueryState.mapBounds || {};
        const centerLat = (bounds.north + bounds.south) / 2;
        const centerLng = (bounds.west + bounds.east) / 2;

        const searchSizes = [
            { offset: 0.00112, zoom: 18 }, // ~125m radius
            { offset: 0.0027, zoom: 16 },  // ~250m radius
            { offset: 0.005, zoom: 16 },   // ~500m radius
            { offset: 0.01, zoom: 15 },    // ~1km radius
            { offset: 0.02, zoom: 14 },    // ~2km radius
        ];

        for (const { offset, zoom } of searchSizes) {
            searchQueryState.mapBounds = {
                west: centerLng - offset,
                east: centerLng + offset,
                south: centerLat - offset,
                north: centerLat + offset
            };

            searchQueryState.isMapVisible = true;
            searchQueryState.zoom = zoom;
            
            const modifiedUrl = `https://www.zillow.com/homes/for_sale/?searchQueryState=${encodeURIComponent(JSON.stringify(searchQueryState))}`;
            
            const input = {
                "searchUrls": [{ url: modifiedUrl }],
                "extractionMethod": "PAGINATION",
                "maxPages": 1,
                "proxyConfiguration": {
                    "useApifyProxy": true
                },
                "memory": 4096
            };

            const radiusMeters = Math.round(offset * 111000);
            console.log(`Searching radius: ${radiusMeters}m (${(radiusMeters * 3.28084).toFixed(0)}ft), zoom: ${zoom}`);
            
            const result = await client.actor("X46xKaa20oUA1fRiP").call(input, {
                memory: 4096
            });
            const dataset = await client.dataset(result.defaultDatasetId).listItems();
            const results = dataset.items as ZillowProperty[];
            
            console.log(`Found ${results.length} results at ${radiusMeters}m radius`);

            if (results.length >= 3) {
                cachedResults = results;
                return cachedResults;
            }
        }

        cachedResults = [];
        return [];

    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    } finally {
        setTimeout(() => {
            isProcessing = false;
        }, 1000);
    }
};

export async function POST(request: Request) {
    try {
        if (!process.env.APIFY_API_TOKEN) {
            throw new Error('APIFY_API_TOKEN is not configured');
        }

        const body = await request.json();
        const searchUrl = body.searchUrls?.[0]?.url;
        
        if (!searchUrl) {
            return NextResponse.json({ error: 'Search URL is required' }, { status: 400 });
        }

        const urlParams = new URL(searchUrl).searchParams;
        const searchQueryStateStr = urlParams.get('searchQueryState');
        const searchQueryState = searchQueryStateStr ? JSON.parse(decodeURIComponent(searchQueryStateStr)) : {};
        
        // Extract location and filters from headers
        const city = request.headers.get('X-City');
        const state = request.headers.get('X-State');
        const filtersStr = request.headers.get('X-Filters');
        const filters = filtersStr ? JSON.parse(filtersStr) : undefined;

        if (city && state) {
            const searchParams: SearchParams = {
                city,
                state,
                filters,
                lat: searchQueryState.mapBounds?.centerLat?.toString(),
                lng: searchQueryState.mapBounds?.centerLng?.toString()
            };

            const cacheManager = new CacheManager();
            const cachedEntry = cacheManager.getCache(searchParams);

            if (cachedEntry) {
                console.log('Returning cached results for', city, state);
                return NextResponse.json(cachedEntry.results);
            }
        }

        const results = await fetchProperties(searchUrl);

        if (results.length > 0 && city && state) {
            const searchParams: SearchParams = {
                city,
                state,
                filters,
                lat: searchQueryState.mapBounds?.centerLat?.toString(),
                lng: searchQueryState.mapBounds?.centerLng?.toString()
            };
            
            const cacheManager = new CacheManager();
            cacheManager.setCache(searchParams, results);
        }

        return NextResponse.json(results);

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}