'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface ZillowListing {
  id: string
  address: string
  price: number | string // Update to allow for string prices
  imgSrc: string
  // Add other fields as needed
}

interface ApifyDataProps {
  zipCode: string
  limit?: number
}

export const ApifyData: React.FC<ApifyDataProps> = ({ zipCode, limit = 5 }) => {
  const [data, setData] = useState<ZillowListing[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/apify-data?zipCode=${zipCode}&limit=${limit}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [zipCode, limit])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Helper function to format price
  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return price.toLocaleString()
    }
    // If it's a string, return as is or try to parse it
    return price
  }

  return (
    <div>
      <h2>Zillow Listings for ZIP: {zipCode} (Showing up to {limit} results)</h2>
      {data.map((listing) => (
        <div key={listing.id} className="mb-4 p-4 border rounded">
          <h3 className="text-xl font-bold">{listing.address}</h3>
          <p className="text-lg font-semibold">Price: ${formatPrice(listing.price)}</p>
          {listing.imgSrc && (
            <Image
              src={listing.imgSrc}
              alt={`Image of ${listing.address}`}
              width={300}
              height={200}
              className="mt-2 rounded"
            />
          )}
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  )
}

