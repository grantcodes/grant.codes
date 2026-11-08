import { createCanvas, Canvas, CanvasRenderingContext2D } from "canvas";
import { Noise } from "../noise.js";
interface Theme {
	gradient: string[];
}

const noise = new Noise(Math.random());

interface GenerateCanvasOptions {
	width?: number;
	height?: number;
	theme: Theme;
	type?: "svg" | "pdf";
}

interface GenerateCanvasResult {
	canvas: Canvas;
	ctx: CanvasRenderingContext2D;
}

const randomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min);

const radians = (deg: number): number => (deg * Math.PI) / 180;

const generateCanvas = (
	options: GenerateCanvasOptions,
): GenerateCanvasResult => {
	const {
		width = 1200,
		height = 1200,
		theme: { gradient: colors },
		type,
	} = options;

	const canvas = createCanvas(width, height, type);
	const ctx = canvas.getContext("2d");

	// Draw the background
	ctx.fillStyle = colors[0];
	ctx.fillRect(0, 0, width, height);

	// Move to top right corner
	ctx.translate(width, 0);

	let ox = 0;
	let oy = 0;

	const spacing = 10;
	const magnitude = (Math.max(width, height) / colors.length) * 2; // Bigger number = bigger rings
	const noise_delta = 20; // Bigger number = less circular
	const noise_radius = 0.5; // Smaller = smoother

	// Generate a random array of 360 items used to base the shapes off of
	let arr: number[] = [];
	ox = randomInt(1, 10000);
	oy = randomInt(1, 10000);
	for (let i = 0; i < 360; i++) {
		arr.push(randomInt(0, 1000) / 1000);
	}

	// Get a noise value between 0 and 1
	const getNoise = (radian: number, dim: number): number => {
		const TAU = 2 * Math.PI;
		let r = radian % TAU;
		if (r < 0.0) {
			r += TAU;
		}
		let val = noise.perlin2(
			ox + Math.cos(r) * (noise_radius + dim / 200),
			oy + Math.sin(r) * (noise_radius + dim / 200),
		);
		val = (val + 1) / 2;
		return val;
	};

	// Draw a shape for each color
	for (let i = colors.length - 1; i > -1; i--) {
		const new_arr: number[] = [];
		ctx.fillStyle = colors[colors.length - i];
		ctx.beginPath();
		for (const ang in arr) {
			const rad = radians(parseInt(ang, 10));
			const noiseVal = getNoise(rad, i * noise_delta);
			// const newRadius = spacing + arr[ang] + noiseVal * magnitude;
			const newRadius = spacing + noiseVal * (i + 1) * magnitude;

			ctx.lineTo(newRadius * Math.cos(rad), newRadius * Math.sin(rad));

			new_arr[parseInt(ang, 10)] = newRadius;
		}

		ctx.fill();
		ctx.closePath();

		arr = new_arr;
	}

	return { canvas, ctx };
};

export { generateCanvas };
