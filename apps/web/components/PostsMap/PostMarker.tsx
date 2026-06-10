"use client";

import { useState } from "react";
import AvatarMarker from "../Map/AvatarMarker";
import Post from "../Post";
import styles from "css/components/posts-map.module.scss";

interface PostMarkerProps {
	post: any;
	[key: string]: any;
}

const PostMarker = ({ post, ...markerProps }: PostMarkerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<AvatarMarker
				{...markerProps}
				onClick={() => setOpen(true)}
				highlight={open}
			/>
			<div
				className={styles["post-container"]}
				data-open={open}
				onClick={() => setOpen(false)}
			>
				<div className={styles.posts}>
					<Post post={post} compact />
				</div>
			</div>
		</>
	);
};

export default PostMarker;
