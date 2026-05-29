import PostList from "components/PostList";
import getPosts from "lib/get/posts";

export interface PageParams {
	page: string;
}

const Home = async (props) => {
	const params = await props.params;
	const posts = await getPosts({ query: params });
	return (
		<PostList
			title={`Page ${params.page}`}
			posts={posts}
			type="home"
			params={params}
		/>
	);
};

export { generateMetadata } from "lib/get/metadata";

export default Home;
