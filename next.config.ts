import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
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
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_GENERAL_AUDIENCE_ID: process.env.RESEND_GENERAL_AUDIENCE_ID,
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 14400,
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
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              ref: true,
              svgoConfig: {
                plugins: [
                  {
                    active: false,
                    name: "removeViewBox",
                  },
                ],
              },
              titleProp: true,
            },
          },
        ],
      },
    },
  },
  experimental: {
    inlineCss: true,
    useTypeScriptCli: true,
    optimizePackageImports: [
      "@contentful/rich-text-react-renderer",
      "@tanstack/react-query",
      "react-aria",
      "react-google-recaptcha",
      "react-intersection-observer",
      "react-player",
      "sonner",
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

    fileLoaderRule.exclude = /\.svg$/i;

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
    const thirtyDays = 60 * 60 * 24 * 30;
    const oneYear = 31536000;
    const htmlCacheControl = `public, max-age=${thirtyDays}, s-maxage=${thirtyDays}, stale-while-revalidate=${oneYear}`;
    const devPageCacheControl = "private, no-store, must-revalidate";
    const pageCacheControl =
      process.env.NODE_ENV === "production"
        ? htmlCacheControl
        : devPageCacheControl;

    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, must-revalidate",
          },
          ...securityHeaders,
        ],
      },
      {
        source: "/refresh-content",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, must-revalidate",
          },
          ...securityHeaders,
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
      {
        source: "/((?!_next|api|images|refresh-content).*)",
        headers: [
          {
            key: "Cache-Control",
            value: pageCacheControl,
          },
          ...securityHeaders,
        ],
      },
    ];
  },
};

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
  child-src *.google.com *.twitter.com *.vimeo.com *.youtube.com vercel.live vimeo.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com *.typekit.net vercel.live;
  img-src * blob: data: images.ctfassets.net placehold.co;
  media-src * 'self';
  connect-src * 'self' *.vimeocdn.com;
  font-src data: 'self' *.typekit.net vercel.live;
  worker-src 'self' *.vercel.app;
  manifest-src 'self' *.vercel.app;
`;
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

export default nextConfig;
