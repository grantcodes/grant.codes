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

const BackfillMap = ({ locations }: BackfillMapProps) => (
	<div>
		{locations.map((location) => (
			<p key={location.isotst}>
				{location.isotst} {location.lat} {location.lon}
			</p>
		))}
		<MapComponent>
			{locations.map((location) => (
				<span
					key={`span-${location.isotst}`}
					style={{ position: "absolute" }}
					anchor={[location.lat, location.lng]}
				></span>
			))}
		</MapComponent>
	</div>
);

export default BackfillMap;
