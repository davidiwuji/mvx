/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: '*.tmdb.org' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://image.tmdb.org https://*.tmdb.org",
              "font-src 'self' data:",
              "frame-src 'self' https://vidsrc.to https://vidsrc.pro https://vidsrc.cc https://player.vidpro.top https://vidlink.pro https://player.videasy.net https://vidrock.net https://embed.su https://www.2embed.cc https://www.youtube.com https://youtube.com https://www.vudu.com",
              "connect-src 'self' https://api.themoviedb.org",
              "media-src 'self' https:",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
export default nextConfig;
