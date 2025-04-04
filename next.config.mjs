/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net", // Facebook CDN
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Avatar & profile images
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
      },
      {
        protocol: "https",
        hostname: "static.xx.fbcdn.net", // Facebook static assets
      },
    ],
  },
};

export default nextConfig;
