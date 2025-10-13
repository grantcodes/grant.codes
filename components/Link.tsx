import Link from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import type React from "react";

interface LinkProps extends Omit<NextLinkProps, "href"> {
	to?: string;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
}

const WrappedLink = ({ to, ...props }: LinkProps) => {
	if (!to) {
		return props.children;
	}

	const publicUrl = process.env.NEXT_PUBLIC_URL ?? "";

	if (to?.startsWith(publicUrl) || to?.startsWith("https://grant.codes")) {
		to = to.replace(publicUrl, "");
		to = to.replace("https://grant.codes", "");
	}

	if (to === "") {
		to = "/";
	}

	if (to?.startsWith("http")) {
		return <a href={to} {...props} />;
	}

	// In App Router, use the actual URL directly as href
	return <Link href={to} {...props}></Link>;
};

export default WrappedLink;
