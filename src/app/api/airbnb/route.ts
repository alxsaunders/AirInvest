import { NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN

    if (!APIFY_API_TOKEN) {
      throw new Error('Apify API token is not configured')
    }

    const location = searchParams.get('location')
    if (!location) {
      throw new Error('Location is required')
    }

    const limitParam = searchParams.get('limit')
    const limit = 2

    const client = new ApifyClient({
      token: APIFY_API_TOKEN,
    })

    const actorInput = {
      "locationQueries": [location],
      "maxListings": limit
    }

    console.log('Airbnb Actor Input:', JSON.stringify(actorInput, null, 2))
    console.log('Calling Airbnb Apify actor...')
    
    const run = await client.actor("NDa1latMI7JHJzSYU").call(actorInput)
    console.log('Actor run finished. Run ID:', run.id)

    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: limit
    })

    console.log('Items fetched:', items.length)

    if (items.length > 0) {
      console.log('First item structure:', JSON.stringify(items[0], null, 2))
    } else {
      console.log('No items returned. Checking actor run details...')
      const runDetail = await client.run(run.id).get()
      console.log('Run details:', JSON.stringify(runDetail, null, 2))
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error in Airbnb API route:', error)
    return NextResponse.json({ error: onmessage || 'An unexpected error occurred' }, { status: 500 })
  }
}