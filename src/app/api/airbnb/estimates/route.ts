// app/api/airbnb/estimates/route.ts
import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: Request) {
  try {
    const { city, state, bedrooms, bathrooms, checkIn, checkOut } = await request.json();

    if (!process.env.APIFY_API_TOKEN) {
      console.error('No Apify token found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      locationQueries: [`${city}, ${state}`],
      minBedrooms: bedrooms,
      minBathrooms: bathrooms,
      locale: "en-US",
      currency: "USD",
      maxItems: 3,
      checkIn: checkIn,
      checkOut: checkOut
    };

    console.log('Calling Apify with input:', input);

    const run = await client.actor("NDa1latMI7JHJzSYU").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: 3
    });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No properties found' },
        { status: 404 }
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property listings' },
      { status: 500 }
    );
  }
}