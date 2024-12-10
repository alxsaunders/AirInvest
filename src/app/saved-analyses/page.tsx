// src/app/saved-analyses/page.tsx
'use client'

import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { InvestmentAnalysis } from '@/types/investment';
import { useRouter } from 'next/navigation';

export default function SavedAnalyses() {
  const { user, isAuthenticated, loading: authLoading } = useUser();
  const [analyses, setAnalyses] = useState<InvestmentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login'); // or wherever your login page is
      return;
    }

    if (user) {
      fetch(`/api/investment-analysis?userId=${user.userId}`)
        .then(res => res.json())
        .then((data: InvestmentAnalysis[]) => {
          setAnalyses(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching analyses:', error);
          setLoading(false);
        });
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading saved analyses...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-8">Saved Analyses</h1>
        {analyses.length === 0 ? (
          <div className="text-center text-gray-400">
            No saved analyses yet. Start by analyzing a property!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  {analysis.propertyDetails.address}
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>ROI: {analysis.roi.toFixed(2)}%</p>
                  <p>Monthly Revenue: ${analysis.monthlyRevenue.toLocaleString()}</p>
                  <p>Purchase Price: ${analysis.purchasePrice.toLocaleString()}</p>
                  <p>Created: {new Date(analysis.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}