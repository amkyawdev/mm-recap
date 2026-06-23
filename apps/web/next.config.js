/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@amkyawdev/ui", "@amkyawdev/types", "@amkyawdev/utils"],
  images: {
    domains: ["localhost", "cloud.appwrite.io"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
