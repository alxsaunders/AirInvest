'use client'

import { Property } from '@/types/property';

interface PropertyStatsProps {
  property: Property;
}

export function PropertyStats({ property }: PropertyStatsProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="text-2xl font-bold text-white">
          {formatPrice(property.price)}
        </div>
        <div className="text-gray-300">
          {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} • 
          {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
        </div>
        {property.yearBuilt && (
          <div className="text-gray-400">
            Built in {property.yearBuilt}
          </div>
        )}
      </div>
      <div className="space-y-2 text-gray-300">
        {property.homeStatus && (
          <div>Status: {property.homeStatus.replace(/_/g, ' ')}</div>
        )}
      </div>
    </div>
  );
}