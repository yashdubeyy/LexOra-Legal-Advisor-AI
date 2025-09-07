import type { NextConfig } from "next";
import path from 'path';

// https://nextjs.org/docs/app/api-reference/next-config-js
const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  /* config options here */
  outputFileTracingRoot: path.join(__dirname),
} as NextConfig;

export default nextConfig;
