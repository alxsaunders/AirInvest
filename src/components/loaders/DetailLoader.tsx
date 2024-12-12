'use client'

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DetailLoader = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-[#1E1E1E] z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-60 h-60"
        >
          <source src="/assets/videos/DetailLoader.webm" type="video/webm" />
          <source src="/assets/videos/DetailLoader.mp4" type="video/mp4" />
          <div className="text-white text-lg">Loading...</div>
        </video>
        <div className="text-white">
          Loading Property Investment Details...
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DetailLoader;