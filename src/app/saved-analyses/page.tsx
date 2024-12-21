'use client'

import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DetailLoader from '@/components/loaders/DetailLoader';

interface SavedAnalysis {
  id: string;
  propertyId: string;
  airbnbRate: number;
  purchasePrice: number;
  annualRevenue: number;
  roi: number;
  monthlyRevenue: number;
  propertyDetails: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
  };
  createdAt: string;
}

export default function SavedAnalyses() {
  const { user } = useUser();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/investment-analysis?userId=${user.userId}`)
        .then(res => res.json())
        .then(setAnalyses)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAnalysisClick = (analysis: SavedAnalysis) => {
    localStorage.setItem('savedAnalysis', JSON.stringify(analysis));
    router.push(`/investdetails?mode=view&id=${analysis.id}`);
  };

  if (loading) {
    return <DetailLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-8">Saved Analyses</h1>
          {analyses.length === 0 ? (
            <div className="text-center text-gray-400">
              No saved analyses yet. Start by analyzing a property!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <div 
                  key={analysis.id} 
                  className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700/50 transition-all"
                  onClick={() => handleAnalysisClick(analysis)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={analysis.propertyDetails.images[0]}
                      alt={analysis.propertyDetails.address}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-house.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                      {analysis.propertyDetails.address}
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>ROI: {analysis.roi.toFixed(2)}%</p>
                      <p>Monthly Revenue: ${analysis.monthlyRevenue.toLocaleString()}</p>
                      <p>Purchase Price: ${analysis.purchasePrice.toLocaleString()}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {analysis.propertyDetails.bedrooms} beds • {analysis.propertyDetails.bathrooms} baths
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="text-center py-4 text-gray-400 mt-auto">
        <p>AirInvest 2024</p>
      </footer>
    </div>
  );
}