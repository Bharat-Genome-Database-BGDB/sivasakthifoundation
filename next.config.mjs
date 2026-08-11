/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Pass Netlify build variables to Next.js client-side code */
  env: {
    NEXT_PUBLIC_NETLIFY_CONTEXT: process.env.CONTEXT,
    NEXT_PUBLIC_GIT_BRANCH: process.env.HEAD || process.env.BRANCH,
  },
};

export default nextConfig;