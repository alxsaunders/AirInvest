'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface AirbnbListing {
  id: string
  name: string
  pricing: {
    label: string
    originalPrice: string | null
    price: string
    qualifier: string
    total: string
  }
  images: Array<{ url: string; captions: string[] }>
  roomType: string
  rating: {
    average: number
    reviewsCount: number
  }
  // Add other fields as needed
}

interface AirbnbListingsProps {
  location: string
  limit: number
}

export const AirbnbListings: React.FC<AirbnbListingsProps> = ({ location, limit }) => {
  const [listings, setListings] = useState<AirbnbListing[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/airbnb?location=${encodeURIComponent(location)}&limit=${limit}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch listings')
        }
        const result = await response.json()
        setListings(result)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [location, limit])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (listings.length === 0) return <div>No listings found for {location}.</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Airbnb Listings in {location} (Showing up to {limit} results)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg">
            {listing.images && listing.images.length > 0 && (
              <Image
                src={listing.images[0].url}
                alt={listing.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
              <p className="text-gray-600 mb-2">{listing.roomType}</p>
              <p className="text-lg font-bold">{listing.pricing.price} per {listing.pricing.qualifier}</p>
              <p className="text-sm text-gray-500">{listing.pricing.total}</p>
              {listing.rating && (
                <p className="text-yellow-500">
                  ★ {listing.rating.average.toFixed(2)} ({listing.rating.reviewsCount} reviews)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}