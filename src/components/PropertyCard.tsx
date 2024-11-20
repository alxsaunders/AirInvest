import React from 'react';
import { ZillowProperty } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardProps {
  property: ZillowProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-md hover:bg-gray-700/50 transition-colors">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={property.imgSrc}
          alt={property.address}
          className="object-cover w-full h-48"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{property.price}</h3>
          <span className="text-sm text-blue-400">{property.brokerName}</span>
        </div>
        <p className="text-gray-300 text-sm mb-2">{property.address}</p>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>{property.beds} beds</span>
          <span>{property.baths} baths</span>
          <span>{property.area} sqft</span>
        </div>
        {property.variableData?.text && (
          <p className="mt-2 text-sm text-gray-400">{property.variableData.text}</p>
        )}
      </CardContent>
    </Card>
  );
}