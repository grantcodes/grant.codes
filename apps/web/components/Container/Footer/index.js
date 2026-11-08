import Icon from "../../Icon";
import { ThemeSwitcher } from "../../ThemeSwitcher";
import instagram from "eva-icons/fill/svg/camera.svg";
import email from "eva-icons/fill/svg/email.svg";
import github from "eva-icons/fill/svg/github.svg";

const Footer = () => (
	<footer className="main-footer">
		<div>
			<a
				className="main-footer__icon"
				href={"mailto:" + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
				rel="me"
			>
				<Icon icon={email} />
				<span className="screen-reader-text">Email</span>
			</a>
			{!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
				<a
					className="main-footer__icon"
					href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM}
					rel="me"
				>
					<Icon icon={instagram} />
					<span className="screen-reader-text">Instagram</span>
				</a>
			)}
			{!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
				<a
					className="main-footer__icon"
					href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB}
					rel="me"
				>
					<Icon icon={github} />
					<span className="screen-reader-text">Github</span>
				</a>
			)}
		</div>
		<p className="h-card screen-reader-text">
			<span className="p-name">{process.env.NEXT_PUBLIC_AUTHOR_NAME}</span>
			<br />
			<a href={process.env.NEXT_PUBLIC_URL} className="u-url" rel="me">
				{process.env.NEXT_PUBLIC_SITE_NAME}
			</a>
			<a
				className="p-email"
				href={"mailto:" + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
			>
				{process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
			</a>
			{!!process.env.NEXT_PUBLIC_META_DESCRIPTION && (
				<data
					className="p-note"
					value={process.env.NEXT_PUBLIC_META_DESCRIPTION}
				/>
			)}
			<data className="u-photo" value={process.env.NEXT_PUBLIC_AUTHOR_PHOTO} />
			{!!process.env.NEXT_PUBLIC_AUTHOR_FEATURED && (
				<data
					className="u-featured"
					value={process.env.NEXT_PUBLIC_AUTHOR_FEATURED}
				/>
			)}
		</p>
		<ThemeSwitcher />
	</footer>
);

export default Footer;
