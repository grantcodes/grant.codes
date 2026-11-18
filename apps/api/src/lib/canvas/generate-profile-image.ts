import { loadImage, Canvas } from "canvas";
import { generateCanvas } from "./generate-canvas.js";
import * as themer from "@grantcodes/themer";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname in es module mode.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateProfileImage(): Promise<Canvas> {
	// TODO: In the future may want to cache file and check for existing daily image.
	// const createdFile = `${__dirname}/../../media/me.jpg`

	// if (fs.existsSync(createdFile)) {
	//   const stats = fs.statSync(createdFile)
	//   const now = new Date().now()
	//   console.log(stats.mtime)
	// }

	const size = 480;
	const { canvas, ctx } = generateCanvas({
		width: size,
		height: size,
		theme: themer.daily(),
		type: undefined,
	});

	const me = await loadImage(__dirname + "/../../../static/me-no-bg.png");
	ctx.drawImage(me, 0 - size, 0);

	return canvas;

	// const buffer = canvas.toBuffer('image/jpeg')
	// fs.writeFile(createdFile, buffer, console.warn)
}
