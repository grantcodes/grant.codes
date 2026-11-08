import classnames from "classnames";
import { Overlay } from "pigeon-maps";
import styles from "css/components/map.module.scss";

interface AvatarMarkerProps {
	image?: string;
	alt?: string;
	highlight?: boolean;
	onClick?: (e: any) => void;
	[key: string]: any;
}

const AvatarMarker = ({
	image = process.env.NEXT_PUBLIC_AUTHOR_PHOTO,
	alt = "A marker showing " + process.env.NEXT_PUBLIC_AUTHOR_NAME,
	highlight = false,
	...props
}: AvatarMarkerProps) => (
	<Overlay
		{...props}
		className={classnames(styles["avatar-marker"], {
			"is-highlighted": highlight,
		})}
	>
		<img src={image} alt={alt} loading="lazy" />
	</Overlay>
);

export default AvatarMarker;
