const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
	reactStrictMode: true,
	productionBrowserSourceMaps: false,
	swcMinify: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	env: {
		CONTENTFUL_CONTENT_DELIVERY_API_KEY:
			process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
		CONTENTFUL_PREVIEW_API_KEY: process.env.CONTENTFUL_PREVIEW_API_KEY,
		CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
		CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
		ENVIRONMENT: process.env.ENVIRONMENT,
		GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
		RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_GENERAL_AUDIENCE_ID: process.env.RESEND_GENERAL_AUDIENCE_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.ctfassets.net",
				port: "",
				pathname: "/**",
			},
		],
	},
	webpack(config) {
		config.plugins.push(new StylelintPlugin());

		// Grab the existing rule that handles SVG imports
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
						value: "s-maxage=1, stale-while-revalidate",
					},
					...securityHeaders,
				],
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "s-maxage=1, stale-while-revalidate",
					},
					...securityHeaders,
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
  connect-src *;
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