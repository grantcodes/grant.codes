import type { Canvas } from "canvas";

import { Hono } from "hono";
import { cors } from "hono/cors";
import * as themer from "@grantcodes/themer";
import { generateCanvas } from "../../lib/canvas/generate-canvas.js";
import { generateProfileImage } from "../../lib/canvas/generate-profile-image.js";

const app = new Hono();

// Apply CORS middleware
app.use("*", cors());
app.options("*", cors());

type BackgroundFormat = "jpg" | "jpeg" | "png" | "svg";

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 1200;

const canvasToSvg = (canvas: Canvas): string => canvas.toBuffer().toString();

const getColorAndFormat = (
	filename: string,
): { color: string | null; format: BackgroundFormat } => {
	let color = null;
	let format = "svg";

	if (filename.includes(".")) {
		[color, format] = filename.split(".");
	} else {
		color = filename;
	}

	if (color === "background") {
		color = null;
	}

	if (!["svg", "jpeg", "jpg", "png"].includes(format)) {
		throw new Error("Invalid format");
	}

	return { color, format: format as BackgroundFormat };
};

// Helper function to generate canvas and return appropriate response
const generateCanvasResponse = async (
	width: number,
	height: number,
	color: string | null,
	format: BackgroundFormat,
) => {
	try {
		const theme = color ? themer.fromColor(color) : themer.daily();
		const canvasOptions = {
			width,
			height,
			theme,
			type: (format === "svg" ? "svg" : undefined) as "svg" | undefined,
		};

		const { canvas } = generateCanvas(canvasOptions);

		switch (format) {
			case "svg": {
				const svg = canvasToSvg(canvas);
				return new Response(svg, {
					headers: {
						"Content-Type": "image/svg+xml",
					},
				});
			}
			case "jpg":
			case "jpeg": {
				const buffer = canvas.toBuffer("image/jpeg");
				return new Response(buffer as BodyInit, {
					headers: {
						"Content-Type": "image/jpeg",
					},
				});
			}
			case "png": {
				const buffer = canvas.toBuffer("image/png");
				return new Response(buffer as BodyInit, {
					headers: {
						"Content-Type": "image/png",
					},
				});
			}
			default:
				return new Response("Unsupported format", { status: 400 });
		}
	} catch (error) {
		console.warn("Error generating background", error);
		return new Response("Error generating background", { status: 500 });
	}
};

app.get("/", async (c) => {
	const theme = themer.daily();
	const { canvas } = generateCanvas({ theme, type: "svg" });
	return c.json({
		theme,
		svg: canvasToSvg(canvas),
	});
});

app.get("/me.jpg", async () => {
	const canvas = await generateProfileImage();
	const buffer = canvas.toBuffer("image/jpeg");
	return new Response(buffer as BodyInit, {
		headers: {
			"Content-Type": "image/jpeg",
		},
	});
});

app.get("/:filename", async (c) => {
	const filename = c.req.param("filename");
	const { color, format } = getColorAndFormat(filename);
	return generateCanvasResponse(DEFAULT_WIDTH, DEFAULT_HEIGHT, color, format);
});

app.get("/:width/:height/:filename", async (c) => {
	const width = parseInt(c.req.param("width"), 10);
	const height = parseInt(c.req.param("height"), 10);
	const filename = c.req.param("filename") || "";
	const { color, format } = getColorAndFormat(filename);

	return generateCanvasResponse(width, height, color, format);
});

export { app as backgroundRouter };
