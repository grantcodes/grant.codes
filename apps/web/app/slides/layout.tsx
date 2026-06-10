"use client";
import Topography from "components/Topography";
import { ThemeSwitcher } from "components/ThemeSwitcher";
import { Reveal } from "./Reveal";

const SlidesLayout: React.FC = ({
	children,
}: {
	children: React.ReactNode;
}) => (
	<>
		<div className="background-layer">
			<div style={{ position: "absolute", top: 0, right: 0 }}>
				<Topography />
			</div>
		</div>
		<Reveal>{children}</Reveal>
		<ThemeSwitcher />
	</>
);

export default SlidesLayout;
