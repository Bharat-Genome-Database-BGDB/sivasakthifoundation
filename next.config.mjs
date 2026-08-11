/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Force a explicit true/false check during Netlify build time
    NEXT_PUBLIC_IS_TEST: 
      process.env.CONTEXT !== 'production' || 
      process.env.BRANCH === 'test' || 
      process.env.HEAD === 'test' ? 'true' : 'false',
  },
};

export default nextConfig;