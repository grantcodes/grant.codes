const subdomains = [
	{ domain: "where.is", path: "/where" },
	{ domain: "who.is", path: "/about" },
	{ domain: "pay", path: "/pay" },
];

const config = {
	serverExternalPackages: ["canvas"],
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["svg-inline-loader"],
				as: "*.js",
			},
		},
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			loader: "svg-inline-loader",
		});

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.weserv.nl",
			},
			{
				protocol: "https",
				hostname: "backend.grant.codes",
			},
		],
	},
	async rewrites() {
		return {
			beforeFiles: subdomains.map((d) => ({
				source: "/",
				has: [
					{
						type: "host",
						value: `${d.domain}.grant.codes`,
					},
				],
				destination: `https://grant.codes/${d.path}/`,
				basePath: false,
			})),
		};
	},
	async redirects() {
		return [
			{
				source: "/.well-known/:wellknown*",
				destination: "https://fed.brid.gy/.well-known/:wellknown*",
				permanent: false,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/fonts/(.*)",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
				],
			},
		];
	},
};

export default config;
