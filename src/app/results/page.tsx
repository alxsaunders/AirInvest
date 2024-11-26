"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface ZillowProperty {
  zpid: string;
  imgSrc: string;
  address: string;
  price: number;
  beds: number | null;
  baths: number | null;
  livingArea: number | null;
  detailUrl: string;
  [key: string]: any;
}
export const checkAuth = async () => {
    const router = useRouter();
    try {
      const user = await getCurrentUser();
      return { success: true, user };
    } catch (error) {
      router.push("/login");
      return { success: false };
    }
   };
   

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<ZillowProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestMade = useRef(false);

  // Format helpers
  const formatNumber = (num: number | null | undefined) => {
    return num?.toLocaleString() ?? "N/A";
  };


  checkAuth()
 
  useEffect(() => {
    const fetchResults = async () => {
      const isFreshSearch = sessionStorage.getItem('isFreshSearch') === 'true';
      const cachedResults = sessionStorage.getItem('propertyResults');
      const cachedParams = sessionStorage.getItem('searchParams');

      if (cachedResults && cachedParams === searchParams.toString() && !isFreshSearch) {
        console.log("Using cached results");
        setProperties(JSON.parse(cachedResults));
        setIsLoading(false);
        return;
      }
      sessionStorage.removeItem('isFreshSearch');

      // Prevent duplicate requests in development mode
      if (requestMade.current) {
        console.log("Request already made, skipping...");
        return;
      }

      setIsLoading(true);
      setError(null);

      const city = searchParams.get("city");
      const state = searchParams.get("state");
      const lat = parseFloat(searchParams.get("lat") || "0");
      const lng = parseFloat(searchParams.get("lng") || "0");

      if (!city || !state) {
        setError("City and state are required");
        setIsLoading(false);
        return;
      }

      const useCache = searchParams.get('useCache') === 'true';
      
      if (useCache) {
        // Fetch from cache
        const cacheResponse = await fetch("/api/check-cache", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: searchParams.get('city'),
            state: searchParams.get('state'),
          }),
        });
        
        const cacheData = await cacheResponse.json();
        if (cacheData.results) {
          setProperties(cacheData.results);
          setIsLoading(false);
          return;
        }
      }

      try {
        requestMade.current = true;

        const searchQueryState = {
          isMapVisible: true,
          mapBounds: {
            west: lng - 0.2,
            east: lng + 0.2,
            south: lat - 0.2,
            north: lat + 0.2,
          },
          filterState: {
            sort: { value: "days" },
            ah: { value: true },
            ...(searchParams.get("minPrice") && {
              price: { min: parseInt(searchParams.get("minPrice")!) },
            }),
            ...(searchParams.get("maxPrice") && {
              price: { max: parseInt(searchParams.get("maxPrice")!) },
            }),
            ...(searchParams.get("beds") && {
              beds: { min: parseInt(searchParams.get("beds")!) },
            }),
            ...(searchParams.get("baths") && {
              baths: { min: parseInt(searchParams.get("baths")!) },
            }),
          },
          isListVisible: true,
          regionSelection: [{ regionId: 0, regionType: 6 }],
        };

        const zillowUrl = `https://www.zillow.com/homes/for_sale/?searchQueryState=${encodeURIComponent(
          JSON.stringify(searchQueryState)
        )}`;

        console.log("Making API request...");
        const response = await fetch("/api/zillow/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            searchUrls: [{ url: zillowUrl }],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);

        await fetch('/api/check-cache', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              city: searchParams.get('city'),
              state: searchParams.get('state'),
              results: data
          })
      });

        sessionStorage.setItem('propertyResults', JSON.stringify(data));
        sessionStorage.setItem('searchParams', searchParams.toString());

      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Failed to fetch results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    // Cleanup function to reset the ref on unmount
    return () => {
      requestMade.current = false;
    };
  }, [searchParams]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Search Results</h1>
            <Link
              href="/dashboard"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              New Search
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-800/50 h-96 rounded-lg overflow-hidden"
              >
                <div className="h-1/2 bg-gray-700/50" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                  <div className="h-4 bg-gray-700/50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Search Results</h1>
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            New Search
          </Link>
        </div>

        <div className="mb-6 text-gray-300">
          Showing results for {searchParams.get("city")},{" "}
          {searchParams.get("state")}
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-300">
              Try adjusting your search criteria to see more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link 
                key={property.zpid}
                href={`/singleresult?url=${encodeURIComponent(property.detailUrl)}`}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  <img
                    src={property.imgSrc || "/placeholder-house.jpg"}
                    alt={property.address || "Property image"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {property.address || "Address not available"}
                    </h3>
                    <p className="text-gray-300 mt-2">
                      ${formatNumber(property.price)}
                    </p>
                    <div className="text-gray-400 mt-2">
                      {formatNumber(property.beds)} beds •{" "}
                      {formatNumber(property.baths)} baths
                      {property.livingArea
                        ? ` • ${formatNumber(property.livingArea)} sqft`
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}