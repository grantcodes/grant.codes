export async function getMetadata({ params }) {
	let metadata = {};

	let title = "";

	// Get page titles
	if (params?.typeOrYear) {
		title = params.typeOrYear;
	}

	if (params?.search) {
		title = `Search: "${params.search}"`;
	}

	if (params?.page) {
		title += ` page ${params.page}`;
	}

	//   if (posts.length === 1) {
	//     title =
	//       'Single ' + title + ' on ' + process.env.NEXT_PUBLIC_SITE_NAME
	//     if (posts[0] && posts[0].properties && posts[0].properties.name) {
	//       title = posts[0].properties.name[0]
	//     }
	//   }

	// Uppercase first letter
	if (title) {
		title = `${title[0].toUpperCase()}${title.slice(1)}`;
		metadata.title = title;
	}

	return metadata;
}

export async function generateMetadata({ params }) {
	const loadedParams = await params;
	return await getMetadata({ params: loadedParams });
}
