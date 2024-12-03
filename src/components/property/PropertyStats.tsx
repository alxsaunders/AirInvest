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

  const formatArea = (area: number): string => {
    return new Intl.NumberFormat('en-US').format(area);
  };

  const getPricePerSqFt = (): string => {
    if (property.livingArea && property.livingArea > 0) {
      const pricePerSqFt = property.price / property.livingArea;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(pricePerSqFt);
    }
    return 'N/A';
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
        {property.livingArea && (
          <div>{formatArea(property.livingArea)} sqft • {getPricePerSqFt()}/sqft</div>
        )}
        {property.homeType && (
          <div>Type: {property.homeType.replace(/_/g, ' ')}</div>
        )}
        {property.homeStatus && (
          <div>Status: {property.homeStatus.replace(/_/g, ' ')}</div>
        )}
      </div>
    </div>
  );
}