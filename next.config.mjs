/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ['photos.zillowstatic.com', 'a0.muscache.com', 'airbnb-photos.com'],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.csv$/,
            use: 'raw-loader'
        });
        return config;
    },
};

export default nextConfig;