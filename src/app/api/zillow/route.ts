import { NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN
    const zipCode = searchParams.get('zipCode')
    const limitParam = searchParams.get('limit')
    const limit = 2

    if (!APIFY_API_TOKEN) {
      throw new Error('Apify API token is not configured')
    }

    if (!zipCode) {
      throw new Error('ZIP code is required')
    }

    const client = new ApifyClient({
      token: APIFY_API_TOKEN,
    })

    const actorInput = {
      "zipCodes": [zipCode],
      "priceMax": 400000,
      "daysOnZillow": "",
      "forSaleByAgent": true,
      "forSaleByOwner": false,
      "forRent": false,
      "sold": false
    }

    console.log('Calling Zillow Apify actor...')
    const run = await client.actor("l7auNT3I30CssRrvO").call(actorInput)
    console.log('Actor run finished. Run ID:', run.id)

    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: limit
    })

    console.log('Items fetched:', items.length)

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error in Zillow API route:', error)
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 })
  }
}