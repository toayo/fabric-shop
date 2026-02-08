/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dpw4t8gnb/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GMAIL_ONLY: process.env.GMAIL_ONLY ?? "false",
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
