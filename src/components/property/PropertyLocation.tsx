// components/property/PropertyLocation.tsx
'use client'

import { MapPin, Building, Home } from 'lucide-react';
import { Property } from '@/types/property';
import DashMap from '@/components/DashMap';

interface PropertyLocationProps {
  property: Property;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  // Check if we have coordinates
  const hasCoordinates = typeof property.latitude === 'number' && 
                        typeof property.longitude === 'number';

  const mapCenter = hasCoordinates ? {
    lat: property.latitude!,
    lng: property.longitude!
  } : {
    // Default to city center if no exact coordinates
    lat: 25.7617,  // Default Florida coordinates
    lng: -80.1918
  };

  const mapMarkers = hasCoordinates ? [{
    position: mapCenter,
    title: property.address.streetAddress
  }] : [];

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <DashMap
          center={mapCenter}
          zoom={15}
          markers={mapMarkers}
        />
      </div>

      {/* Address and Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Section */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-gray-300">
              <p className="font-medium">{property.address.streetAddress}</p>
              <p>
                {property.address.city}, {property.address.state} {property.address.zipcode}
              </p>
            </div>
          </div>

          {property.address.neighborhood && (
            <div className="flex items-center space-x-3">
              <Home className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="text-gray-300">
                <p className="text-sm font-medium">Neighborhood</p>
                <p>{property.address.neighborhood}</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Location Details */}
        <div className="space-y-4">
          {property.address.community && (
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="text-gray-300">
                <p className="text-sm font-medium">Community</p>
                <p>{property.address.community}</p>
              </div>
            </div>
          )}
          
          {/* Add additional location details here if needed */}
        </div>
      </div>
    </div>
  );
}