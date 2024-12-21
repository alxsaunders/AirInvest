"use client";

import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarketAnalysis from "@/components/MarketAnalysis";
import PropertySearch from "@/components/PropertySearch";
import Map from "@/components/DashMap";
import Script from "next/script";
import { LocationUpdate } from "@/types/property";
import VideoLoader from "@/components/loaders/DefaultLoader";
import Icon from '@/components/Icon';
import React from 'react';
import SearchSection from '@/components/SearchSection';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

interface SavedAnalysis {
  id: string;
  propertyId: string;
  propertyDetails: {
    address: string;
    images: string[];
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const { theme, setTheme } = useTheme(); // Use global theme context
  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLngLiteral>({
      lat: 28.5999998,
      lng: -81.3392352,
    });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const fetchSavedAnalyses = async () => {
    try {
      const currentUser = await getCurrentUser();
      const response = await fetch(`/api/investment-analysis?userId=${currentUser.userId}`);
      const data = await response.json();
      setSavedAnalyses(data.slice(0, 6)); // Limit to 6 items
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchSavedAnalyses();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setMapLoaded(false);
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        try {
          const attributes = await fetchUserAttributes();
          setFirstName(
            attributes.given_name || attributes.name?.split(" ")[0] || null
          );
        } catch (error) {
          console.error("Error fetching user attributes:", error);
          setFirstName(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
    }
  };

  const handleLocationUpdate = (location: LocationUpdate) => {
    setSelectedLocation(location);
  };

  const handleCityChange = useCallback(async (cityName: string) => {
    if (!window.google || !cityName) return;

    const geocoder = new google.maps.Geocoder();
    try {
      const result = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode({ address: cityName }, (results, status) => {
            if (status === "OK" && results) {
              resolve(results);
            } else {
              reject(status);
            }
          });
        }
      );

      const location = {
        lat: result[0].geometry.location.lat(),
        lng: result[0].geometry.location.lng(),
      };
      setSelectedLocation(location);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }, []);

  if (isLoading) {
    if (mapLoaded) {
      setMapLoaded(false);
    }
    return (
      <div className="relative min-h-screen">
      {/* Background from theme */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url('/assets/photos/${theme === 'night' ? 'CityNight.jpg' : 'Daylight.jpg'}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[4px] bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
      </div>
      
  

      {/* Video Loader */}
      <VideoLoader />
    </div>
    );
  }

  if (!firstName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please sign in to access the dashboard
          </p>
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
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
        onLoad={() => setMapLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="min-h-screen relative">
        {/* Greeting Section with Theme Selector */}
        <div className="w-full bg-gray-800/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">
                {getGreeting()},{" "}
                <span className="text-blue-400">{firstName}</span>
              </h1>
              
              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-gray-700/50 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-10"
                >
                  <option value="night">Night Theme</option>
                  <option value="day">Day Theme</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the dashboard content */}
        <div className="relative z-10">
          {/* Property Search Section */}
          <div className="relative pt-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <SearchSection onLocationUpdate={handleLocationUpdate} />
              </div>
            </div>
          </div>

          {/* Market Analysis and Map Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Analysis Side */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-8">
                  Market Analysis
                </h1>
                <MarketAnalysis onCityChange={handleCityChange} />
              </div>

              {/* Map Side */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-8">Map View</h2>
                <div
                  className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 mb-4"
                  style={{ height: "450px" }}
                >
                  {mapLoaded ? (
                    <Map
                      center={selectedLocation}
                      zoom={12}
                      markers={[
                        {
                          position: selectedLocation,
                          title: "Selected Location",
                        },
                      ]}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Saved Analyses Section */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                      Saved Analyses
                    </h2>
                    <Link 
                      href="/saved-analyses"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                    {savedAnalyses.length === 0 ? (
                      <p className="text-gray-400 text-center">No saved analyses yet</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {savedAnalyses.map((analysis) => (
                          <div
                            key={analysis.id}
                            onClick={() => router.push(`/investdetails?mode=view&id=${analysis.id}`)}
                            className="relative cursor-pointer group"
                          >
                            <div className="relative h-24 w-full rounded-lg overflow-hidden">
                              <Image
                                src={analysis.propertyDetails.images[0]}
                                alt={analysis.propertyDetails.address}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-end p-2">
                                <p className="text-sm text-white truncate">
                                  {analysis.propertyDetails.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="text-center py-4 text-gray-400 bg-transparent">
            <p>AirInvest 2024</p>
          </footer>
        </div>
      </div>
    </>
  );
}