// components/property/PropertyDetail.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyStats } from './PropertyStats';
import { PriceHistory } from './PriceHistory';
import { PhotoGallery } from './PhotoGallery';
import { PropertyLocation } from './PropertyLocation';
import Link from 'next/link';
import { Property } from '@/types/property';

interface PropertyDetailProps {
  property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  console.log('PropertyDetail Render:', {
    hasPhotos: Boolean(property.originalPhotos),
    photoCount: property.originalPhotos?.length,
    hasPriceHistory: Boolean(property.priceHistory),
    priceHistoryCount: property.priceHistory?.length,
    fullAddress: property.address
  });

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/results"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Results
          </Link>
        </div>

        <div className="space-y-8">
          {property.originalPhotos && property.originalPhotos.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              <PhotoGallery photos={property.originalPhotos} />
            </div>
          )}

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {property.address.streetAddress}
              </CardTitle>
              <p className="text-gray-300">
                {property.address.city}, {property.address.state} {property.address.zipcode}
              </p>
            </CardHeader>
            <CardContent>
              <PropertyStats property={property} />
            </CardContent>
          </Card>

          {property.priceHistory && property.priceHistory.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceHistory priceHistory={property.priceHistory} />
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyLocation property={property} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}