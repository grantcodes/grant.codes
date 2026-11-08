import Post from "components/Post";

const NewPostTemplate = () => (
	<Post
		className="postrchild-template"
		post={{
			type: ["h-entry"],
			properties: {
				name: ["New Post"],
				content: [
					{
						html: [
							"<p>This is my new post page. I use it with my postrchild extension to write new posts.</p>",
						],
					},
				],
				photo: [""],
				url: [
					(typeof window !== "undefined"
						? window.location.href
						: (process.env.NEXT_PUBLIC_URL ?? "")
					).replace(/['"]+/g, ""),
				],
			},
			cms: { postType: "article" },
		}}
	/>
);

export default NewPostTemplate;

export const metadata = {
	title: "New Post",
	description: "The new post page for grant.codes",
	robots: {
		index: false,
	},
};
