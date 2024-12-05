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
      router.push(`/singleresult?url=${encodeURIComponent(url)}`);
    } catch (err) {
      setError('Invalid URL format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <input
          type="url"
          className="w-full px-8 py-6 text-lg bg-white/10 border border-white/20 
                     text-white rounded-2xl focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent placeholder-gray-400
                     transition-all duration-300 ease-in-out hover:bg-white/15"
          placeholder="Paste Zillow Home Details URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Zillow Property URL"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2
                     px-8 py-4 bg-blue-600 text-white text-lg font-medium 
                     rounded-xl hover:bg-blue-700 active:bg-blue-800
                     transition-colors duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-400 text-sm pl-2 animate-fadeIn">
          {error}
        </p>
      )}
      {/* <p className="mt-3 text-gray-400 text-sm pl-2">
        Example: https://www.zillow.com/homedetails/...
      </p> */}
    </form>
  );
};

export default ZillowDetailSearch;