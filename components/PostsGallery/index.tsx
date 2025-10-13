"use client";

import { Fragment } from "react";
import Image from "next/image";
import classnames from "classnames";
import Post from "../Post";
import Link from "../Link";
import getPostPhotos from "./get-post-photos";
import { nextImageLoader } from "lib/image-proxy";
import styles from "css/components/posts-gallery.module.scss";

const imageLoader =
	process.env.NODE_ENV === "production" ? undefined : nextImageLoader;

type GalleryType = "collection" | "feed";

interface PostsGalleryProps {
	posts?: any[];
	type?: GalleryType;
	maxWidth?: number;
}

const PostsGallery = ({
	posts = [],
	type = "collection",
	maxWidth = 33.333,
}: PostsGalleryProps) => {
	const getPhotos = (posts: any[]) => {
		let photos: any[] = [];
		for (const post of posts) {
			photos = [...photos, ...getPostPhotos(post)];
		}
		return photos;
	};

	const photos = getPhotos(posts);

	return (
		<>
			<div className={styles.gallery}>
				{photos.map((photo, i) =>
					type === "feed" ? (
						<Link
							className={styles.item}
							key={"posts-gallery-photo-" + i}
							to={photo.permalink}
						>
							<Image
								className={styles.photo}
								src={photo.photo}
								width={200}
								height={200}
								loader={imageLoader}
								sizes="(min-width: 1135px) 172px, (min-width: 468px) 20vw, 33vw"
								style={{
									maxWidth: "100%",
									height: "auto",
								}}
							/>
						</Link>
					) : (
						<Fragment key={"posts-gallery-photo-" + i}>
							<div
								className={classnames("h-cite", styles.item)}
								maxWidth={maxWidth}
							>
								<Link to={photo.permalink} className="u-url">
									<Image
										className={styles.photo}
										src={photo.photo}
										alt={photo.alt}
										width={200}
										height={200}
										loader={imageLoader}
										sizes="(min-width: 1135px) 172px, (min-width: 468px) 20vw, 33vw"
										style={{
											width: "100%",
											height: "auto",
										}}
									/>
									<data className="u-photo" value={photo.photo} />
								</Link>
							</div>
							<data className="u-photo" value={photo.photo} />
						</Fragment>
					),
				)}
			</div>

			{/* If this is a feed page, output valid mf2 as hidden html */}
			{type === "feed" && (
				<div className="screen-reader-text">
					{posts.map((post) => (
						<Post
							post={post}
							key={`hidden-photo-posts-${post.properties.url[0]}`}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default PostsGallery;
