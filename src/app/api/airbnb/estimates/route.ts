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

    // Start the actor run but don't wait for it to finish
    const run = await client.actor("NDa1latMI7JHJzSYU").start(input);
    console.log('Actor run started with ID:', run.id);

    // Wait for up to 20 seconds for the run to complete
    const startTime = Date.now();
    const timeout = 15000; // 15 seconds
    
    while (Date.now() - startTime < timeout) {
      // Check the run status
      const runInfo = await client.run(run.id).get();
      
      if (runInfo.status === 'SUCCEEDED' || runInfo.status === 'FAILED') {
        console.log('Run completed with status:', runInfo.status);
        break;
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // After timeout or completion, abort the run if still running
    const finalRunInfo = await client.run(run.id).get();
    if (finalRunInfo.status === 'RUNNING' || finalRunInfo.status === 'READY') {
      console.log('Aborting run due to timeout');
      await client.run(run.id).abort();
    }

    // Fetch whatever results are available
    console.log('Fetching available results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: 3
    });

    // Return whatever we got (could be empty, partial, or complete results)
    console.log(`Returning ${items?.length || 0} items`);
    return NextResponse.json(items || []);
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property listings' },
      { status: 500 }
    );
  }
}