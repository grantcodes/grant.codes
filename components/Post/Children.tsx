import PostsGallery from "../PostsGallery";

interface ChildrenProps {
	children: any[];
}

const Children = ({ children }: ChildrenProps) => (
	<div className="card__breakout">
		<PostsGallery posts={children} />
	</div>
);

export default Children;
