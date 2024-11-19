'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>;
}

const DashMap: React.FC<MapProps> = ({ center, zoom, markers = [] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);

  // Check if Google Maps is ready
  useEffect(() => {
    const checkGoogle = () => {
      if (window.google) {
        setGoogleReady(true);
      } else {
        setTimeout(checkGoogle, 100);
      }
    };
    checkGoogle();
  }, []);

  // Reinitialize map when dependencies change or Google becomes ready
  useEffect(() => {
    if (!googleReady) return;
    
    const initMap = () => {
      setIsLoading(true);

      if (!mapDivRef.current) return;

      // Clear existing map
      if (mapRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }

      // Create new map
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center,
        zoom,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Add markers
      markers.forEach(marker => {
        const newMarker = new google.maps.Marker({
          position: marker.position,
          map: mapRef.current,
          title: marker.title
        });
        markersRef.current.push(newMarker);
      });

      setIsLoading(false);
    };

    initMap();

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [center, zoom, markers, googleReady]);

  // Force remount on center change
  const mapKey = `map-${center.lat}-${center.lng}-${zoom}`;

  return (
    <div key={mapKey} className="relative h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      <div 
        ref={mapDivRef}
        className="w-full h-full rounded-md"
      />
    </div>
  );
};

export default DashMap;