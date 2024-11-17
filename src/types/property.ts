export interface Property {
    zpid: string;
    imgSrc: string;
    detailUrl: string;
    price: string;
    unformattedPrice: number;
    address: string;
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressZipcode: string;
    beds: number;
    baths: number;
    area: number;
    latLong: {
      latitude: number;
      longitude: number;
    };
    variableData?: {
      type: string;
      text: string;
    };
    brokerName?: string;
  }
  
  export interface SearchFilters {
    minPrice: string;
    maxPrice: string;
    beds: string;
    baths: string;
  }
  
  export interface LocationUpdate {
    lat: number;
    lng: number;
  }