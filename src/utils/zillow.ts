// utils/zillow.ts

import { SearchFilters } from '@/types/property';

interface ZillowSearchFilters {
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
  }
  
  export function generateZillowUrl(
    city: string,
    state: string,
    filters: ZillowSearchFilters
  ): string {
    // Format city name (replace spaces with dashes and make lowercase)
    const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
    const formattedState = state.toLowerCase();
    
    // Base URL format that Zillow expects
    const baseUrl = `https://www.zillow.com/homes/${formattedCity}-${formattedState}/`;
  
    // Create the searchQueryState object
    const searchQueryState = {
      pagination: {},
      mapBounds: {
        west: -180,
        east: 180,
        south: -90,
        north: 90
      },
      regionSelection: [],
      isMapVisible: true,
      filterState: {
        sortSelection: { value: "globalrelevanceex" },
        isAllHomes: { value: true },
        ...(filters.minPrice && { price: { min: parseInt(filters.minPrice) } }),
        ...(filters.maxPrice && { price: { max: parseInt(filters.maxPrice) } }),
        ...(filters.beds && { beds: { min: parseInt(filters.beds) } }),
        ...(filters.baths && { baths: { min: parseInt(filters.baths) } })
      },
      isListVisible: true,
      mapZoom: 12
    };
  
    // Create the final URL with searchQueryState
    const searchParams = new URLSearchParams({
      searchQueryState: JSON.stringify(searchQueryState)
    });
  
    return `${baseUrl}?${searchParams.toString()}`;
  }