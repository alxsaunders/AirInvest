// components/ZillowDetailSearch.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ZillowDetailSearch = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a Zillow URL');
      return;
    }

    try {
      // Use the same URL structure as your existing implementation
      router.push(`/singleresult?url=${encodeURIComponent(url)}`);
    } catch (err) {
      setError('Invalid URL format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="url"
          className="w-full px-4 py-3 text-gray-900 rounded-lg"
          placeholder="Enter Zillow property URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Zillow Property URL"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-500 text-sm">
          {error}
        </p>
      )}
    </form>
  );
};

export default ZillowDetailSearch;