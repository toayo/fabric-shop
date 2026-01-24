/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
