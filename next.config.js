/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  env: {
    NEXT_PUBLIC_GMAIL_ONLY: process.env.GMAIL_ONLY ?? "false",
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
