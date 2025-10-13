import Image from "next/image";

interface PostPhotoImageProps {
	src: string;
	alt?: string;
	width?: number | null;
	height?: number | null;
	className?: string;
}

const PostPhotoImage = ({
	src,
	alt = "",
	width = null,
	height = null,
	className = "",
}: PostPhotoImageProps) => {
	if (width && height) {
		return (
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				className={className}
				sizes="100vw"
				style={{
					width: "100%",
					height: "auto",
				}}
			/>
		);
	}

	return <img src={src} alt={alt} className={className} loading="lazy" />;
};

export default PostPhotoImage;
