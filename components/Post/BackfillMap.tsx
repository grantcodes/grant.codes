import MapComponent from "../Map";

interface Location {
	isotst: string;
	lat: number;
	lon: number;
	lng: number;
}

interface BackfillMapProps {
	locations: Location[];
}

const BackfillMap = ({ locations }: BackfillMapProps) => {
	const firstLocation = locations[0];
	return (
		<div>
			{locations.map((location) => (
				<p key={location.isotst}>
					{location.isotst} {location.lat} {location.lon}
				</p>
			))}
			<MapComponent location={`geo:${firstLocation.lat},${firstLocation.lng}`}>
				{locations.map((location) => (
					<span
						key={`span-${location.isotst}`}
						style={{ position: "absolute" }}
						data-anchor={JSON.stringify([location.lat, location.lng])}
					></span>
				))}
			</MapComponent>
		</div>
	);
};

export default BackfillMap;
