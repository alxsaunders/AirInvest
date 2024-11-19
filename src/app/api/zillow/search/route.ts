import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

interface Property {
  zpid: string;
  imgSrc: string;
  address: string;
  price: number;
  beds: number | null;
  baths: number | null;
  livingArea: number | null;
  detailUrl: string;
  [key: string]: any;
}

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN || '',
});

let isProcessing = false;
let lastRequestTime = 0;
let cachedResults: Property[] | null = null;
const LOCK_DURATION = 5000;

const fetchProperties = async (searchUrl: string): Promise<Property[]> => {
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

        // Much finer progression of search areas
        const searchSizes = [
           
            // { offset: 0.001, zoom: 18 },  // ~100m radius
            { offset: 0.00112, zoom: 18 }, //~125 rad (low)
            { offset: 0.0027, zoom: 16 }, //250 rad  (mid)
            { offset: 0.005, zoom: 16 },  // ~500m radius
            { offset: 0.01, zoom: 15 },   // ~1km radius
            { offset: 0.02, zoom: 14 },   // ~2km radius
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
                },"memory": 4096
            };

            const radiusMeters = Math.round(offset * 111000);
            console.log(`Searching radius: ${radiusMeters}m (${(radiusMeters * 3.28084).toFixed(0)}ft), zoom: ${zoom}`);
            
            const result = await client.actor("X46xKaa20oUA1fRiP").call(input, {
                memory: 4096});
            const dataset = await client.dataset(result.defaultDatasetId).listItems();
            const results = dataset.items as Property[];
            
            console.log(`Found ${results.length} results at ${radiusMeters}m radius`);

            if (results.length >= 3) {
                cachedResults = results
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
        const body = await request.json();
        
        if (!process.env.APIFY_API_TOKEN) {
            throw new Error('APIFY_API_TOKEN is not configured');
        }

        const searchUrl = body.searchUrls?.[0]?.url;
        if (!searchUrl) {
            return NextResponse.json({ error: 'Search URL is required' }, { status: 400 });
        }

        const results = await fetchProperties(searchUrl);
        return NextResponse.json(results);

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}