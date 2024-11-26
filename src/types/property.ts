export interface LocationUpdate {
  lat: number;
  lng: number;
}

export interface SearchFilters {
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
}

export interface ZillowProperty {
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


export interface PhotoSource {
  url: string;
  width: number;
}

export interface MixedSources {
  jpeg: PhotoSource[];
  webp: PhotoSource[];
}

export interface PropertyPhoto {
  caption: string;
  mixedSources: MixedSources;
}

export interface PriceHistoryItem {
  date: string;
  time: number;
  price: number;
  pricePerSquareFoot: number;
  priceChangeRate: number;
  event?: string;
}

export interface PropertyAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  neighborhood: string | null;
  community: string | null;
  subdivision: string | null;
}

export interface Property {
  zpid: number;
  city: string;
  state: string;
  homeStatus: string;
  address: PropertyAddress;
  bedrooms: number;
  bathrooms: number;
  price: number;
  yearBuilt: number;
  streetAddress: string;
  zipcode: string;
  priceHistory: PriceHistoryItem[];
  originalPhotos: PropertyPhoto[];
}