// app/api/zillow/detail/route.ts
import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      startUrls: [{ url }],
      limitPages: 1
    };

    console.log('Fetching property details from Zillow...');
    const run = await client.actor("ENK9p4RZHg0iVso52").call(input);
    
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
  }
}