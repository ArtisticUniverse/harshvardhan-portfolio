/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion"],
  },
};

export default nextConfig;
