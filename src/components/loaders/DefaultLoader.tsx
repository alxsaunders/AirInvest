import Head from 'next/head';
import { useEffect } from 'react';

const VideoLoader = () => {
  useEffect(() => {
    // Lock scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to remove lock when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="preload" href="/assets/videos/loader.webm" as="video" />
      </Head>
      <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-[#1E1E1E] z-40 flex items-center justify-center">
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
      </div>
    </>
  );
};

export default VideoLoader;