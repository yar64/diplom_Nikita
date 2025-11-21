/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    turbo: {
      rules: {
        '*.png': {
          loaders: ['file-loader'],
          as: '*.png'
        }
      }
    }
  }
};

export default nextConfig;
