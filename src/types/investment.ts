export interface InvestmentAnalysis {
    id: string; // UUID
    userId: string; // Cognito user ID
    propertyId: string; // Zillow property ID
    airbnbRate: number;
    purchasePrice: number;
    annualRevenue: number;
    roi: number;
    monthlyRevenue: number;
    createdAt: string;
    propertyDetails: {
      address: string;
      bedrooms: number;
      bathrooms: number;
      sqft: number;
    };
  }