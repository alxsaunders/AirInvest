// components/property/PropertyDetail.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyStats } from "./PropertyStats";
import { PriceHistory } from "./PriceHistory";
import { PhotoGallery } from "./PhotoGallery";
import { PropertyLocation } from "./PropertyLocation";
import Link from "next/link";
import { Property } from "@/types/property";

interface PropertyDetailProps {
  property: Property;
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  console.log("PropertyDetail Render:", {
    hasPhotos: Boolean(property.originalPhotos),
    photoCount: property.originalPhotos?.length,
    hasPriceHistory: Boolean(property.priceHistory),
    priceHistoryCount: property.priceHistory?.length,
    fullAddress: property.address,
  });

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Results
          </Link>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Property Details */}
          <div className="lg:col-span-7 space-y-7">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">
                  {property.address.streetAddress}
                </CardTitle>
                <p className="text-gray-300">
                  {property.address.city}, {property.address.state}{" "}
                  {property.address.zipcode}
                </p>
              </CardHeader>
              <CardContent>
                <PropertyStats property={property} />
              </CardContent>
            </Card>

            {property.originalPhotos && property.originalPhotos.length > 0 && (
              <div className="rounded-lg overflow-hidden">
                <PhotoGallery photos={property.originalPhotos} />
              </div>
            )}

            {property.priceHistory && property.priceHistory.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceHistory priceHistory={property.priceHistory} />
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyLocation property={property} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Investment Details */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="bg-gray-800/50 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Investment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add your InvestmentDetails component here */}
                <div className="text-gray-300">
                  Investment calculator and details will go here
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
