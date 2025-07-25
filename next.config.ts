import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    CONTENTFUL_CONTENT_DELIVERY_API_KEY:
      process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
    CONTENTFUL_PREVIEW_API_KEY: process.env.CONTENTFUL_PREVIEW_API_KEY,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    ENVIRONMENT: process.env.ENVIRONMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY,
    HUBSPOT_LEAD_GENERATION_FORM_ID:
      process.env.HUBSPOT_LEAD_GENERATION_FORM_ID,
    HUBSPOT_PORTAL_ID: process.env.HUBSPOT_PORTAL_ID,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_GENERAL_AUDIENCE_ID: process.env.RESEND_GENERAL_AUDIENCE_ID,
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "downloads.ctfassets.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "videos.ctfassets.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      use: {
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "removeViewBox",
                active: false,
              },
            ],
          },
        },
      },
    });

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // Bundle analyzer for production builds
    if (!dev && !isServer && process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        }),
      );
    }

    return config;
  },
  async redirects() {
    if (process.env.ENVIRONMENT === "production") {
      return [...productionRedirects, ...sharedRedirects];
    }

    return sharedRedirects;
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Redirect test and home slug pages on Production
const sources = ["/:slug(test-page.*)"];

const productionRedirects = sources.map((source) => ({
  source,
  destination: "/",
  permanent: true,
}));

const sharedRedirects = [
  {
    source: "/home",
    destination: "/",
    permanent: true,
  },
  {
    source: "/contact-us",
    destination: "/contact",
    permanent: true,
  },
  {
    source: "/work/category",
    destination: "/work",
    permanent: true,
  },
];

// https://securityheaders.com
const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  "*.youtube.com",
  "*.vimeo.com",
  "*.google.com",
  "*.google-analytics.com",
  "*.gstatic.com",
  "*.googletagmanager.com",
  "*.vercel-insights.com",
  "*.vercel.app",
  "vercel.live",
];
const ContentSecurityPolicy = `
  default-src 'self';
  script-src ${scriptSrc.join(" ")};
  child-src *.youtube.com *.vimeo.com *.google.com *.twitter.com vercel.live;
  style-src 'self' 'unsafe-inline' *.googleapis.com *.typekit.net vercel.live;
  img-src * blob: data: images.ctfassets.net placehold.co;
  media-src * 'self';
  connect-src * 'self' *.vimeocdn.com;
  font-src data: 'self' *.typekit.net vercel.live;
  worker-src 'self' *.vercel.app;
  manifest-src 'self' *.vercel.app;
`;
const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

export default nextConfig;
