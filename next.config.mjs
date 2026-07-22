/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Obmedzenie počtu worker procesov pri builde — nutné na zdieľanom hostingu
  // (CloudLinux NPROC limit), inak `next build` padá s chybou spawn EAGAIN.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  i18n: {
    // Nový jazyk: pridajte kód sem a vytvorte slovník v src/locales (pozri src/locales/index.ts).
    locales: ["sk", "en"],
    defaultLocale: "sk",
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
