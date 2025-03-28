'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/types/property';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PropertyDetail } from '@/components/property/PropertyDetail';
import  DetailLoader  from "@/components/loaders/DetailLoader"

export default function SingleResultPage() {
  const searchParams = useSearchParams();
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchPropertyDetails = async () => {
      if (fetchInProgress.current) return;
  
      try {
        const url = searchParams.get('url');
        if (!url) {
          setError('No property URL provided');
          setLoading(false);
          return;
        }
  
        // Cache key and cache management
        const cacheKey = `property-${url}`;
        const cacheListKey = 'property-cache-list'; // Key to track cached keys
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setPropertyData(parsedData);
          setLoading(false);
          return;
        }
  
        // If no cached data, proceed with fetch
        fetchInProgress.current = true;
  
        const response = await fetch('/api/zillow/property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch property details');
        }
  
        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData[0] : rawData;
  
        // Cache the fetched data
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
  
        // Manage cache size
        let cacheList = JSON.parse(sessionStorage.getItem(cacheListKey) || '[]');
  
        if (!cacheList.includes(cacheKey)) {
          cacheList.push(cacheKey);
          if (cacheList.length > 3) {
            const oldestKey = cacheList.shift(); // Remove oldest entry
            sessionStorage.removeItem(oldestKey);
          }
          sessionStorage.setItem(cacheListKey, JSON.stringify(cacheList));
        }
  
        setPropertyData(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error fetching property:', err);
          setError(err.message || 'An error occurred');
        }
      } finally {
        fetchInProgress.current = false;
        setLoading(false);
      }
    };
  
    fetchPropertyDetails();
  
    return () => {
      controller.abort();
      fetchInProgress.current = false;
    };
  }, [searchParams]);



 //Preload images once data is available
  useEffect(() => {
    if (propertyData?.originalPhotos) {
      propertyData.originalPhotos.forEach(photo => {
        const img = new Image();
        img.src = photo.mixedSources.jpeg[0].url;
      });
    }
  }, [propertyData]);

  if (loading) {
    window.scrollTo(0, 0);
    return (
      <DetailLoader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <button 
              onClick={() => {
                // Clear cache for this property and reload
                const url = searchParams.get('url');
                if (url) {
                  sessionStorage.removeItem(`property-${url}`);
                }
                window.location.reload();
              }}
              className="block mt-4 text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">No property data available</div>
      </div>
    );
  }

  return <PropertyDetail property={propertyData} />;
}