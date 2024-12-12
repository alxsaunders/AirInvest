'use client'

import { useEffect } from 'react';

const InvestLoader = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="flex-1 bg-[#1E1E1E] z-40 flex items-center justify-center min-h-[calc(100vh-64px)]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-40 h-40"
      >
        <source src="/assets/videos/InvestLoader.webm" type="video/webm" />
        <source src="/assets/videos/InvestLoader.mp4" type="video/mp4" />
        <div className="text-white text-lg">Loading...</div>
      </video>
    </div>
  );
};

export default InvestLoader;