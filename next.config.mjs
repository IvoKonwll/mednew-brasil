/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Não bloquear build de produção por lint; rode `npm run lint` no CI.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
