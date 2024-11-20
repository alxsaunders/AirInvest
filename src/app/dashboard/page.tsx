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
import VideoLoader from "@/components/VideoLoader";

export default function Dashboard() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
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

  useEffect(() => {
    checkAuth();
  }, []);

  // Effect to handle map refresh after loading
  useEffect(() => {
    if (!isLoading) {
      // Reset map state when loading finishes
      setMapLoaded(false);
      // Small delay to ensure proper reinitialization
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 100);
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

  // Handle location updates from PropertySearch
  const handleLocationUpdate = (location: LocationUpdate) => {
    setSelectedLocation(location);
  };

  // Handle location updates from MarketAnalysis
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
    // Reset map state when entering loading
    if (mapLoaded) {
      setMapLoaded(false);
    }
    return <VideoLoader />;
  }

  if (!firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
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

  const handleMapLoad = () => {
    console.log("Map script loaded");
    setMapLoaded(true);
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
        onLoad={handleMapLoad}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Greeting Section */}
        <div className="w-full bg-gray-800/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()},{" "}
              <span className="text-blue-400">{firstName}</span>
            </h1>
          </div>
        </div>

        {/* Property Search Section */}
        <div className="relative pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-8">
                Search Properties
              </h1>
              <PropertySearch onLocationUpdate={handleLocationUpdate} />
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

              <h2 className="text-2xl font-bold text-white mb-4">
                Saved Location
              </h2>
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}