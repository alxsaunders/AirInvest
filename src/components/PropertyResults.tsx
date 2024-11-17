// components/PropertyResults.tsx
'use client';

import React from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

interface PropertyResultsProps {
  properties: Property[];
  isLoading: boolean;
}

export default function PropertyResults({ properties, isLoading }: PropertyResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="animate-pulse bg-gray-800/50 h-96 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center text-white py-8">
        No properties found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.zpid} property={property} />
      ))}
    </div>
  );
}