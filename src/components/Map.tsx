'use client'; 

import { useCallback, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

type MapProps = {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>;
};

const Map: React.FC<MapProps> = ({ 
  center = { lat: 51.505, lng: -0.09 },
  zoom = 12,
  markers = []
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map>();
  
  const { isLoaded, loadError: jsApiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    version: "weekly",
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = undefined;
  }, []);

  if (jsApiLoadError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-700 font-semibold">Error Loading Google Maps</h3>
        <p className="text-red-600">
          Please check your API key and make sure billing is enabled.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 border border-gray-300 bg-gray-50 rounded-md">
        Loading Maps...
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={{ 
          width: '100%', 
          height: '400px',
          borderRadius: '0.375rem'
        }}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={marker.position}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;