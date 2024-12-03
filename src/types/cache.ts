import { ZillowProperty, SearchFilters } from './property';

export interface CacheEntry {
  timestamp: string;
  results: ZillowProperty[];
  searchParams: SearchParams;
}

export interface SearchParams {
  city: string;
  state: string;
  lat?: string;
  lng?: string;
  filters?: SearchFilters;
}   