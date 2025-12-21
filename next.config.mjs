/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // ВАЖНО: УБИРАЕМ ВСЁ ПРО TURBO
  // Никаких experimental.turbo вообще!

  // Можно даже так:
  experimental: {
    // Пусто! Никакого turbo!
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.symlinks = false;
    }
    return config;
  }
};

export default nextConfig;