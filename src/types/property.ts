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