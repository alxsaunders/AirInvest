'use client'

import { Property } from '@/types/property';

interface PropertyLocationProps {
  property: Property;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <div className="text-gray-300">
      <p>{property.address.streetAddress}</p>
      <p>
        {property.address.city}, {property.address.state} {property.address.zipcode}
      </p>
      {property.address.neighborhood && (
        <p className="mt-2">Neighborhood: {property.address.neighborhood}</p>
      )}
    </div>
  );
}