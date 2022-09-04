/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/auth",
  //       destination: "/",
  //       parmanent: false,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
