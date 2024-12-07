// components/PropertySearch.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SearchFilters, LocationUpdate } from "@/types/property";
import VideoLoader from "@/components/VideoLoader";
import { createPortal } from 'react-dom';

interface PropertySearchProps {
  onLocationUpdate: (location: LocationUpdate) => void;
}

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", 
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", 
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", 
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", 
  "WI", "WY"
];

const priceRanges = [
  { label: "Any Price", value: "" },
  { label: "Under $200k", value: "0-200000" },
  { label: "$200k-$400k", value: "200000-400000" },
  { label: "$400k-$600k", value: "400000-600000" },
  { label: "$600k-$800k", value: "600000-800000" },
  { label: "$800k-$1M", value: "800000-1000000" },
  { label: "Over $1M", value: "1000000-" },
];

const bedOptions = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
];

const bathOptions = [
  { label: "Any", value: "" },
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];

export default function PropertySearch({ onLocationUpdate }: PropertySearchProps) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);

  const LoadingOverlay = () => {
    return createPortal(
      <div className="fixed inset-0 bg-[#1E1E1E] z-[9999] flex items-center justify-center">
        <VideoLoader />
      </div>,
      document.body
    );
  };

  const handlePriceRangeChange = (range: string) => {
    if (!range) {
      setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
      return;
    }
    const [min, max] = range.split("-");
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !selectedState) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get coordinates
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode(
            { address: `${city}, ${selectedState}` },
            (results, status) => {
              if (status === "OK" && results) {
                resolve(results);
              } else {
                reject(status);
              }
            }
          );
        }
      );

      const location = {
        lat: result[0].geometry.location.lat(),
        lng: result[0].geometry.location.lng(),
      };

      onLocationUpdate(location);

      // Store search parameters in session storage
      const searchParams = {
        city,
        state: selectedState,
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        filters: {
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          beds: filters.beds || undefined,
          baths: filters.baths || undefined,
        },
      };

      sessionStorage.setItem('lastSearchParams', JSON.stringify(searchParams));

      // Check cache
      const cacheResponse = await fetch("/api/check-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      });

      const cacheData = await cacheResponse.json();

      if (!cacheResponse.ok) {
        throw new Error(cacheData.error || 'Failed to check cache');
      }

      // If cache exists and is valid, use it
      if (cacheData.hasCache) {
        setSearchResults(cacheData.results);
        sessionStorage.setItem('searchResults', JSON.stringify(cacheData.results));
        sessionStorage.setItem('cacheTimestamp', cacheData.timestamp);
      } else {
        // Prepare search URL params for Zillow
        const searchQueryState = {
          usersSearchTerm: `${city}, ${selectedState}`,
          mapBounds: {
            west: location.lng - 0.1,
            east: location.lng + 0.1,
            south: location.lat - 0.1,
            north: location.lat + 0.1,
            centerLat: location.lat,
            centerLng: location.lng,
          },
          filterState: {
            sort: { value: "days" },
            ah: { value: true },
            ...(filters.minPrice && {
              price: { min: parseInt(filters.minPrice) },
            }),
            ...(filters.maxPrice && {
              price: { max: parseInt(filters.maxPrice) },
            }),
            ...(filters.beds && {
              beds: { min: parseInt(filters.beds) },
            }),
            ...(filters.baths && {
              baths: { min: parseInt(filters.baths) },
            }),
          },
        };

        const zillowUrl = `https://www.zillow.com/homes/for_sale/?searchQueryState=${encodeURIComponent(
          JSON.stringify(searchQueryState)
        )}`;

        const searchResponse = await fetch("/api/zillow/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-City": city,
            "X-State": selectedState,
            "X-Filters": JSON.stringify(filters),
          },
          body: JSON.stringify({
            searchUrls: [{ url: zillowUrl }],
          }),
        });

        if (!searchResponse.ok) {
          const errorData = await searchResponse.json();
          throw new Error(errorData.error || 'Failed to fetch properties');
        }

        const results = await searchResponse.json();
        setSearchResults(results);
        sessionStorage.setItem('searchResults', JSON.stringify(results));
      }

      // Navigate to results page with search parameters
      const urlParams = new URLSearchParams({
        city,
        state: selectedState,
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.beds && { beds: filters.beds }),
        ...(filters.baths && { baths: filters.baths }),
      });

      router.push(`/results?${urlParams.toString()}`);
    } catch (error) {
      console.error("Search failed:", error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {error && (
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && <LoadingOverlay />}
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* City and State Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
              className="w-full px-6 py-4 rounded-l-full bg-white/20 backdrop-blur-md 
                       text-white placeholder-white/70 text-lg border border-white/10
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-40">
            <button
              type="button"
              onClick={() => setIsStateOpen(!isStateOpen)}
              className="w-full px-6 py-4 rounded-r-full bg-white/20 backdrop-blur-md 
                       text-white text-lg border border-white/10 flex items-center justify-between"
            >
              {selectedState || "State"}
              <ChevronDown className="w-5 h-5" />
            </button>

            {isStateOpen && (
              <div className="absolute z-50 w-full mt-2 max-h-60 overflow-auto bg-gray-800 rounded-lg shadow-lg">
                {states.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      setSelectedState(state);
                      setIsStateOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <select
            value={`${filters.minPrice}-${filters.maxPrice}`}
            onChange={(e) => handlePriceRangeChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/10"
          >
            {priceRanges.map((range) => (
              <option
                key={range.value}
                value={range.value}
                className="bg-gray-800"
              >
                {range.label}
              </option>
            ))}
          </select>

          <select
            value={filters.beds}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, beds: e.target.value }))
            }
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/10"
          >
            {bedOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-800"
              >
                {option.label} Beds
              </option>
            ))}
          </select>

          <select
            value={filters.baths}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, baths: e.target.value }))
            }
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/10"
          >
            {bathOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-800"
              >
                {option.label} Baths
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}