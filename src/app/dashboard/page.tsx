'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MarketAnalysis from '@/components/MarketAnalysis';
import Map from '@/components/DashMap';
import Script from 'next/script';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>({
    lat: 28.5999998,
    lng: -81.3392352
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser();
      const email = userData.signInDetails?.loginId;
      setUserName(email ? email.split('@')[0] : null);
    } catch (error) {
      setUserName(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = useCallback(async (cityName: string) => {
    if (!window.google || !cityName) return;
    
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: cityName }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      
      const location = {
        lat: result[0].geometry.location.lat(),
        lng: result[0].geometry.location.lng()
      };
      setSelectedLocation(location);
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, []);

  const handleGoogleMapsLoad = () => {
    setMapLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!userName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to access the dashboard</p>
          <Link 
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        onLoad={handleGoogleMapsLoad}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-white mb-8">Market Analysis</h1>
          <MarketAnalysis onCityChange={handleCityChange} />
        </div>

        <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Map View</h2>
            {mapLoaded && (
              <Map
                center={selectedLocation}
                zoom={12}
                markers={[{ position: selectedLocation, title: 'Selected Location' }]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}