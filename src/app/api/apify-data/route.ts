import { NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const zipCode = searchParams.get('zipCode')
    const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN
    const limitParam = searchParams.get('limit')
    const limit = 5 

    console.log('ZIP Code:', zipCode)
    console.log('API Token exists:', !!APIFY_API_TOKEN)
    console.log('Limit:', limit)

    if (!APIFY_API_TOKEN) {
      throw new Error('Apify API token is not configured')
    }

    if (!zipCode) {
      throw new Error('ZIP code is required')
    }

    const client = new ApifyClient({
      token: APIFY_API_TOKEN,
    })

    const input = {
      "zipCodes": [zipCode],
      "priceMax": 400000,
      "daysOnZillow": "",
      "forSaleByAgent": true,
      "forSaleByOwner": false,
      "forRent": false,
      "sold": false
    }

    console.log('Calling Apify actor...')
    const run = await client.actor("l7auNT3I30CssRrvO").call(input)
    console.log('Actor run finished, fetching items...')
    
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: limit,
      fields: ['id', 'address', 'price', 'imgSrc'] // Specify the fields we want to retrieve
    })
    
    console.log('Items fetched:', items.length)

    // Transform the data if necessary
    const transformedItems = items.map(item => ({
      id: item.id,
      address: item.address,
      price: item.price, // Keep price as-is, whether it's a number or string
      imgSrc: item.imgSrc
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 })
  }
}