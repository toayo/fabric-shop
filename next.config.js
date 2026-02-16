/** @type {import('next').NextConfig} */
const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dpw4t8gnb";

const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudinaryCloudName}/**`,
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GMAIL_ONLY: process.env.GMAIL_ONLY ?? "false",
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
