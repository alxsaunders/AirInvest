'use client'

import React, { useEffect, useState } from 'react';
import { Property } from '@/types/property';

interface AirbnbListing {
  pricing: {
    price: string;
  };
}

export default function InvestDetails() {
  const [listing, setListing] = useState<AirbnbListing | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Get data from localStorage instead of URL
    const airbnbData = localStorage.getItem('selectedAirbnb');
    const propertyData = localStorage.getItem('zillowProperty');
    
    if (airbnbData && propertyData) {
      try {
        const parsedListing = JSON.parse(airbnbData);
        const parsedProperty = JSON.parse(propertyData);
        setListing(parsedListing);
        setProperty(parsedProperty);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }, []);

  if (!listing || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading investment details...</div>
      </div>
    );
  }

  // Get the nightly rate from Airbnb listing
  const nightlyRate = parseFloat(listing.pricing.price.replace('$', ''));
  
  // Calculate potential annual revenue
  const annualRevenue = nightlyRate * 365 * 0.75; // 75% occupancy
  
  // Calculate ROI
  const roi = ((annualRevenue - (property.price * 0.1)) / property.price) * 100; // Assuming 10% annual costs

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Property Overview */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{property.address.streetAddress}</h1>
          <p className="text-gray-400">Purchase Price: ${property.price.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ROI Analysis */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">ROI Analysis</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Return on Investment</p>
                <p className="text-xl text-white">{roi.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">Based on purchase price and estimated revenue</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Purchase Price</p>
                <p className="text-xl text-white">${property.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Revenue Projections</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Nightly Rate</p>
                <p className="text-xl text-white">${nightlyRate}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Monthly Revenue (75% occupancy)</p>
                <p className="text-xl text-white">
                  ${Math.round(nightlyRate * 30 * 0.75).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Annual Revenue (75% occupancy)</p>
                <p className="text-xl text-white">
                  ${Math.round(annualRevenue).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Property Details</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Property Info</p>
                <p className="text-white mt-1">{property.bedrooms} beds • {property.bathrooms} baths</p>
                <p className="text-white">{property.livingArea} sqft</p>
                <p className="text-white">Built in {property.yearBuilt}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white mt-1">{property.address.city}, {property.address.state}</p>
                <p className="text-white">{property.address.zipcode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}