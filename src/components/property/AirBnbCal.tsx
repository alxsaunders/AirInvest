'use client'

import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Property } from '@/types/property';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';

interface AirBnbCalProps {
 property: Property;
}

interface AirbnbListing {
 url: string;
 id: string;
 name: string;
 title: string;
 rating: {
   label: string;
   localizedLabel: string;
   average: number;
   reviewsCount: number;
 };
 images: Array<{
   url: string;
   captions: string[];
 }>;
 pricing: {
   label: string;
   originalPrice: string | null;
   price: string;
   qualifier: string;
   total: string;
 };
}

const AirBnbCal = ({ property }: AirBnbCalProps) => {
 const [loading, setLoading] = useState(false);
 const [results, setResults] = useState<AirbnbListing[]>([]);
 const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});
 const router = useRouter();

 const nextImage = (listingId: string, totalImages: number) => {
   setCurrentImageIndexes(prev => ({
     ...prev,
     [listingId]: ((prev[listingId] || 0) + 1) % totalImages
   }));
 };

 const prevImage = (listingId: string, totalImages: number) => {
   setCurrentImageIndexes(prev => ({
     ...prev,
     [listingId]: ((prev[listingId] || 0) - 1 + totalImages) % totalImages
   }));
 };

 const fetchEstimates = async () => {
   setLoading(true);
   setError(null);

   try {
     const response = await fetch('/api/airbnb/estimates', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         city: property.address.city,
         state: property.address.state,
         bedrooms: property.bedrooms,
         bathrooms: property.bathrooms,
       }),
     });

     const data = await response.json();
     console.log('Raw API response:', data);

     if (!response.ok) {
       throw new Error(data.error || 'Failed to fetch estimates');
     }

     if (!data || data.length === 0) {
       setError("No similar properties found in your area.");
       return;
     }

     setResults(data);
   } catch (error) {
     console.error('Error fetching Airbnb estimates:', error);
     setError(error instanceof Error ? error.message : "Failed to fetch Airbnb estimates. Please try again later.");
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="space-y-6">
     {error && (
       <Alert variant="destructive">
         <div className="flex items-center gap-2">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </div>
       </Alert>
     )}

     {!results.length && (
       <div
         className="w-32 h-32 mx-auto cursor-pointer transition-transform hover:scale-105"
         onClick={!loading ? fetchEstimates : undefined}
       >
         {loading ? (
           <CircularProgressbar
             value={70}
             styles={buildStyles({
               pathColor: "#3b82f6",
               trailColor: "#1f2937",
               textColor: "#ffffff",
               rotation: 0.25,
             })}
           />
         ) : (
           <div className="w-full h-full rounded-full border-4 border-blue-500 flex items-center justify-center text-center p-4 hover:bg-gray-700/30 transition-colors">
             <span className="text-sm font-medium text-gray-200">
               Get Airbnb Estimates
             </span>
           </div>
         )}
       </div>
     )}

     {loading ? (
       <div className="space-y-4">
         {[1, 2, 3].map((i) => (
           <div
             key={i}
             className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
           >
             <div className="flex space-x-4">
               <Skeleton className="w-[150px] h-[100px]" />
               <div className="flex-grow space-y-2">
                 <Skeleton className="h-6 w-1/3" />
                 <Skeleton className="h-4 w-1/4" />
                 <Skeleton className="h-4 w-1/2" />
               </div>
             </div>
           </div>
         ))}
       </div>
     ) : (
       results.length > 0 && (
         <>
           <div className="grid grid-cols-1 gap-4">
             {results.map((listing) => (
               <div
                 key={listing.id}
                 className={`bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/50 ${
                   selectedListingId === listing.id
                     ? "ring-2 ring-blue-500"
                     : ""
                 }`}
                 onClick={() => setSelectedListingId(listing.id)}
               >
                 <div className="p-4">
                   <div className="flex space-x-4">
                     <div className="relative w-[150px] h-[100px]">
                       <img
                         src={
                           listing.images[currentImageIndexes[listing.id] || 0]
                             ?.url || "/api/placeholder/150/100"
                         }
                         alt={listing.name}
                         className="w-full h-full object-cover rounded-lg"
                       />
                       {listing.images.length > 1 && (
                         <>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               prevImage(listing.id, listing.images.length);
                             }}
                             className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70"
                           >
                             <ChevronLeft className="w-4 h-4 text-white" />
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               nextImage(listing.id, listing.images.length);
                             }}
                             className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 hover:bg-black/70"
                           >
                             <ChevronRight className="w-4 h-4 text-white" />
                           </button>
                           <div className="absolute bottom-1 right-1 bg-black/50 px-2 py-0.5 rounded text-xs text-white">
                             {(currentImageIndexes[listing.id] || 0) + 1}/
                             {listing.images.length}
                           </div>
                         </>
                       )}
                     </div>
                     <div className="flex flex-col justify-between flex-grow">
                       <div>
                         <h3 className="text-lg font-medium text-gray-200">
                           {listing.pricing.price}/night
                         </h3>
                         <a
                           href={listing.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           onClick={(e) => e.stopPropagation()}
                           className="text-sm text-blue-400 hover:text-blue-300 transition-colors truncate block"
                         >
                           {listing.name}
                         </a>
                         <p className="text-sm text-gray-400 mt-2">
                           {property.bedrooms} beds • {property.bathrooms} baths
                         </p>
                         <p className="text-sm text-gray-400">
                           {property.address.city}, {property.address.state}
                         </p>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-400">
                           Rating: {listing.rating.average} ⭐ (
                           {listing.rating.reviewsCount})
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           <div className="flex justify-center mt-6">
             <button
               onClick={() => {
                 if (selectedListingId) {
                   const selectedProperty = results.find(
                     (r) => r.id === selectedListingId
                   );
                   localStorage.setItem(
                     "selectedAirbnb",
                     JSON.stringify(selectedProperty)
                   );
                   localStorage.setItem(
                     "zillowProperty",
                     JSON.stringify(property)
                   );
                   router.push("/investdetails");
                 }
               }}
               disabled={!selectedListingId}
               className={`px-6 py-3 rounded-lg transition-all ${
                 selectedListingId
                   ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                   : "bg-gray-600 text-gray-400 cursor-not-allowed"
               }`}
             >
               Continue to Investment Analysis
             </button>
           </div>
         </>
       )
     )}
   </div>
 );
};

export default AirBnbCal;