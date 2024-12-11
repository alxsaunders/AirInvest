'use client'

import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    // Store the analysis data in localStorage
    localStorage.setItem('savedAnalysis', JSON.stringify(analysis));
    router.push(`/investdetails?mode=view&id=${analysis.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-8">Saved Analyses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <div 
              key={analysis.id} 
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-700/50 transition-all"
              onClick={() => handleAnalysisClick(analysis)}
            >
              <h3 className="text-lg font-medium text-white mb-4">
                {analysis.propertyDetails.address}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>ROI: {analysis.roi.toFixed(2)}%</p>
                <p>Monthly Revenue: ${analysis.monthlyRevenue.toLocaleString()}</p>
                <p>Purchase Price: ${analysis.purchasePrice.toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  Created: {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}