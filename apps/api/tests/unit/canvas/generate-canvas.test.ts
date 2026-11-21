import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { generateCanvas } from "../../../src/lib/canvas/generate-canvas.js";
import { mockDependencies } from "../../setup.js";

// Mock the dependencies
const { mockCanvas, mockNoise, mockThemer } = mockDependencies;

describe("generateCanvas", () => {
	before(() => {
		// Mock canvas module
		const canvasMock = mockCanvas();
		// @ts-ignore
		global.canvas = canvasMock;

		// Mock noisejs module
		const noiseMock = mockNoise();
		// @ts-ignore
		global.noisejs = noiseMock;
	});

	it("should generate canvas with default options", () => {
		const theme = {
			gradient: ["#ff0000", "#00ff00", "#0000ff"],
		};

		const result = generateCanvas({ theme });

		assert.ok(result.canvas);
		assert.ok(result.ctx);
		assert.strictEqual(typeof result.canvas.toBuffer, "function");
	});

	it("should generate canvas with custom dimensions", () => {
		const theme = {
			gradient: ["#ff0000", "#00ff00", "#0000ff"],
		};

		const result = generateCanvas({
			width: 800,
			height: 600,
			theme,
		});

		assert.ok(result.canvas);
		assert.ok(result.ctx);
	});

	it("should generate canvas with null type", () => {
		const theme = {
			gradient: ["#ff0000", "#00ff00", "#0000ff"],
		};

		const result = generateCanvas({
			theme,
			type: null,
		});

		assert.ok(result.canvas);
		assert.ok(result.ctx);
	});

	it("should generate canvas with SVG type", () => {
		const theme = {
			gradient: ["#ff0000", "#00ff00", "#0000ff"],
		};

		const result = generateCanvas({
			theme,
			type: "svg",
		});

		assert.ok(result.canvas);
		assert.ok(result.ctx);
	});

	it("should handle different gradient lengths", () => {
		const theme1 = {
			gradient: ["#ff0000", "#00ff00"],
		};

		const theme2 = {
			gradient: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
		};

		const result1 = generateCanvas({ theme: theme1 });
		const result2 = generateCanvas({ theme: theme2 });

		assert.ok(result1.canvas);
		assert.ok(result2.canvas);
	});

	it("should handle empty gradient", () => {
		const theme = {
			gradient: [],
		};

		// This should not throw an error, but might produce unexpected results
		const result = generateCanvas({ theme });

		assert.ok(result.canvas);
		assert.ok(result.ctx);
	});
});
