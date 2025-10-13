import PostMarker from "./PostMarker";
import MapComponent from "../Map";
import getLatLngFromMf2 from "../Map/lib/getLatLngFromMf2";
import boundaries from "../Map/lib/getBoundaries";
import styles from "css/components/posts-map.module.scss";

interface PostsMapProps {
	title: string;
	posts: any[];
}

const PostsMap = ({ title, posts }: PostsMapProps) => {
	const getBoundaries = () => {
		const markers = posts
			.filter(
				(post) =>
					post &&
					post.properties &&
					(post.properties.location || post.properties.checkin),
			)
			.map((post) => {
				let location = null;
				if (post.properties.checkin) {
					location = post.properties.checkin[0];
				} else {
					location = post.properties.location[0];
				}
				return getLatLngFromMf2(location);
			});
		const width =
			typeof document !== "undefined" ? document.body.clientWidth : 1200;
		const height =
			typeof document !== "undefined" ? document.body.clientHeight : 1200;
		return boundaries({
			markers,
			width,
			height,
		});
	};

	const viewport = getBoundaries();

	return (
		<>
			<h2 className="page-title" style={{ position: "relative", zIndex: 1 }}>
				{title}
			</h2>

			<MapComponent
				className={styles.map}
				location={`geo:${viewport.latitude},${viewport.longitude}`}
				zoom={viewport.zoom}
				defaultWidth={1200}
				defaultHeight={1200}
			>
				{posts.map((post) => {
					let center = null;
					if (post.properties.location) {
						center = getLatLngFromMf2(post.properties.location[0]);
					}
					if (post.properties.checkin) {
						center = getLatLngFromMf2(post.properties.checkin[0]);
					}
					if (center === null) {
						return null;
					}
					return (
						<PostMarker
							key={`post-marker-${post.properties.url[0]}`}
							post={post}
							anchor={center}
						/>
					);
				})}
			</MapComponent>
		</>
	);
};

export default PostsMap;
