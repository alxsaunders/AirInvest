import Head from 'next/head';

const VideoLoader = () => {
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
          className="w-40 h-40"
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