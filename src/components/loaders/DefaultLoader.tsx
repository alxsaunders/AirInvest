'use client';

import { useEffect } from 'react';

interface VideoLoaderProps {
  text?: string;
}

const VideoLoader = ({ text }: VideoLoaderProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-60 h-60"
      >
        <source src="/assets/videos/loader.webm" type="video/webm" />
        <source src="/assets/videos/loader.mp4" type="video/mp4" />
        <div className="text-white text-lg">Loading...</div>
      </video>
      {text && (
        <div className="text-white text-md mt-2">
          {text}
        </div>
      )}
    </div>
  );
};

export default VideoLoader;