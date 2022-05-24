/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // serverRuntimeConfig: {
  //   cors: true,
  // }
  // react: {
  //   useSuspense: false,
  //   // wait: true
  // }
  // experimental: {
  //   concurrentFeatures: true,
  // },
}

module.exports = {
  nextConfig,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};