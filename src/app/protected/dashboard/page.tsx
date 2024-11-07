'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="relative pt-20">
        {/* Search Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              Search Location
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Winter Park, 32792"
                  className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md 
                           text-white placeholder-white/70 text-lg border border-white/10
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2
                           hover:text-blue-400 transition-colors"
                >
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}