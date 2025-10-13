"use client";

import classnames from "classnames";
import { Map as PigeonMap } from "pigeon-maps";
import AvatarMarker from "./AvatarMarker";
import getLatLngFromMf2 from "./lib/getLatLngFromMf2";
import styles from "../../css/components/map.module.scss";
import type { ReactNode, CSSProperties } from "react";

interface MapProps {
	children?: ReactNode;
	location: any;
	className?: string;
	style?: CSSProperties;
	hideDefaultMarker?: boolean;
	zoom?: number;
	metaWheelZoom?: boolean;
	defaultWidth?: number;
	defaultHeight?: number;
	[key: string]: any;
}

const Map = ({
	children,
	location,
	className = "",
	style,
	hideDefaultMarker,
	zoom = 14,
	metaWheelZoom = true,
	defaultWidth = 300,
	defaultHeight = 300,
	...mapProps
}: MapProps) => {
	// Get the center from the location provided
	const center = (getLatLngFromMf2(location) ?? [0, 0]) as [number, number];

	const provider = (x: number, y: number, z: number) =>
		`https://api.mapbox.com/styles/v1/grantcodes/ckctekw712q2k1jph87kqekjk/tiles/256/${z}/${x}/${y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

	return (
		<div className={classnames("map", styles.map, className)} style={style}>
			<PigeonMap
				center={center}
				zoom={zoom}
				metaWheelZoom={metaWheelZoom}
				defaultWidth={defaultWidth}
				defaultHeight={defaultHeight}
				{...mapProps}
				provider={provider}
			>
				{children ? children : <AvatarMarker anchor={center} />}
			</PigeonMap>
		</div>
	);
};

export default Map;
