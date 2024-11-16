'use client';

import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!mapDivRef.current || !window.google) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center,
        zoom,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    }

    // Update center and zoom when they change
    mapRef.current.setCenter(center);
    mapRef.current.setZoom(zoom);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const newMarker = new google.maps.Marker({
        position: marker.position,
        map: mapRef.current,
        title: marker.title
      });
      markersRef.current.push(newMarker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [center, zoom, markers]);

  return (
    <div 
      ref={mapDivRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '0.375rem',
      }}
    />
  );
};

export default DashMap;