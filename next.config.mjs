/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['photos.zillowstatic.com', 'a0.muscache.com', 'airbnb-photos.com'],
    },
  };
  
  export default nextConfig;