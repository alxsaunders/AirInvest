// app/singleresult/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PropertyDetail } from '@/components/property/PropertyDetail';

export default function SingleResultPage() {
  const searchParams = useSearchParams();
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const url = searchParams.get('url');
        if (!url) {
          setError('No property URL provided');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/zillow/property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch property details');
        }

        const rawData = await response.json();
        
        // Detailed logging of the first item if it's an array
        if (Array.isArray(rawData) && rawData.length > 0) {
          const firstItem = rawData[0];
          console.log('Detailed Property Data:', {
            address: firstItem.address,
            price: firstItem.price,
            beds: firstItem.bedrooms || firstItem.beds,
            baths: firstItem.bathrooms || firstItem.baths,
            yearBuilt: firstItem.yearBuilt,
            homeStatus: firstItem.homeStatus,
            photos: firstItem.originalPhotos || firstItem.photos,
            priceHistory: firstItem.priceHistory,
            livingArea: firstItem.livingArea,
            lotSize: firstItem.lotSize,
            homeType: firstItem.homeType
          });
        } else {
          console.log('Raw Data (not an array):', rawData);
        }

        // If the response is an array, take the first item
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
        setPropertyData(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [searchParams]);

  // Also log whenever propertyData changes
  useEffect(() => {
    if (propertyData) {
      console.log('PropertyData State:', {
        address: propertyData.address,
        price: propertyData.price,
        photos: propertyData.originalPhotos || 'No photos',
        priceHistory: propertyData.priceHistory || 'No price history'
      });
    }
  }, [propertyData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">No property data available</div>
      </div>
    );
  }

  return <PropertyDetail property={propertyData} />;
}