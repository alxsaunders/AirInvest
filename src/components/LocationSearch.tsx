'use client'

import React, { useState } from 'react'
import { AirbnbListings } from './AirbnbListings'

export const LocationSearch: React.FC = () => {
  const [location, setLocation] = useState('')
  const [limit, setLimit] = useState('10')
  const [searchTriggered, setSearchTriggered] = useState(false)

  const handleSearch = () => {
    if (location) {
      setSearchTriggered(true)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., London, New York)"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Limit"
          className="border p-2 mr-2 w-20"
          min="1"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {searchTriggered && <AirbnbListings location={location} limit={parseInt(limit)} />}
    </div>
  )
}