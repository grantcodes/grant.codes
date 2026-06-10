import { DefaultSeo } from "next-seo";

const url = process.env.NEXT_PUBLIC_URL;
const name = process.env.NEXT_PUBLIC_SITE_NAME;
const description = process.env.NEXT_PUBLIC_META_DESCRIPTION;
function parseJsonEnv(value, fallback) {
	if (!value) return fallback;
	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
}

const image = parseJsonEnv(process.env.NEXT_PUBLIC_META_IMAGE, {
	url: "/img/og-default.jpg",
});
const twHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

const DefaultMeta = () => (
	<>
		<DefaultSeo
			title={name}
			titleTemplate={`%s – ${name}`}
			description={description}
			canonical={url}
			openGraph={{
				type: "website",
				locale: "en_GB",
				url: url,
				site_name: name,
				images: [image],
			}}
			twitter={{
				handle: twHandle,
				site: twHandle,
				cardType: "summary_large_image",
			}}
			additionalMetaTags={[
				{ charSet: "utf-8", key: "meta-charset" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
					key: "meta-viewport",
				},
				{
					name: "mobile-web-app-capable",
					value: "yes",
					key: "meta-mobile-web-app-capable",
				},
				{
					name: "apple-mobile-web-app-capable",
					content: "yes",
					key: "meta-apple-mobile-web-app-capable",
				},
				{
					name: "msapplication-TileImage",
					content: "/icons/mstile-144x144.png",
					key: "meta-msapptile",
				},
				{
					name: "apple-mobile-web-app-status-bar-style",
					content: "black-translucent",
					key: "meta-apple-status-bar",
				},
			]}
		/>
	</>
);

export default DefaultMeta;
