// Test setup and configuration for Node.js test runner

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
process.env.NEXT_PUBLIC_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_MEDIA_BASE_URL = "http://localhost:4000/media";
process.env.NEXT_PUBLIC_AUTHOR_NAME = "Test Author";
process.env.NEXT_PUBLIC_AUTHOR_PHOTO = "http://localhost:4000/media/photo.jpg";
process.env.NEXT_PUBLIC_AUTHOR_EMAIL = "test@example.com";
process.env.MICROPUB_TOKEN = "test-token";
process.env.TOKEN_SECRET = "test-secret";
process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER = "test-password";

// Global test utilities
export const testUtils = {
	// Helper to create mock requests
	createMockRequest: (method: string, url: string, body?: any) => ({
		method,
		url,
		body,
		headers: new Headers({
			"content-type": "application/json",
		}),
	}),

	// Helper to create mock Hono context
	createMockContext: (req: Request) => {
		const store = new Map<string, any>();
		return {
			// Minimal Hono Context shape used by our middleware and routes in tests
			req: {
				header: (name: string) => req.headers.get(name),
				// expose original Request for anything that might need it
				raw: req,
			} as unknown as any,
			set: (key: string, value: any) => {
				store.set(key, value);
			},
			get: (key: string) => {
				return store.get(key);
			},
			// Response helpers mirroring Hono Context methods
			status: (code: number) => ({
				json: (data: any) =>
					new Response(JSON.stringify(data), { status: code }),
				text: (data: string) => new Response(data, { status: code }),
				body: (data: any) => new Response(data, { status: code }),
			}),
			json: (data: any, code?: number) =>
				new Response(JSON.stringify(data), { status: code ?? 200 }),
			text: (data: string, code?: number) =>
				new Response(data, { status: code ?? 200 }),
			body: (data: any, code?: number) =>
				new Response(data, { status: code ?? 200 }),
		};
	},
};

// Mock external dependencies
export const mockDependencies = {
	// Mock canvas
	mockCanvas: () => ({
		createCanvas: (width: number, height: number, type?: string) => ({
			getContext: () => ({
				fillStyle: "",
				fillRect: () => {},
				translate: () => {},
				beginPath: () => {},
				lineTo: () => {},
				fill: () => {},
				closePath: () => {},
				drawImage: () => {},
			}),
			toBuffer: (format?: string) => Buffer.from("mock-image-data"),
		}),
		loadImage: async (path: string) => ({
			width: 100,
			height: 100,
		}),
	}),

	// Mock noise
	mockNoise: () => ({
		Noise: class MockNoise {
			constructor(seed?: number) {}
			perlin2(x: number, y: number) {
				return Math.random() * 2 - 1;
			}
		},
	}),

	// Mock themer
	mockThemer: () => ({
		daily: () => ({
			gradient: ["#ff0000", "#00ff00", "#0000ff"],
		}),
		fromColor: (color: string) => ({
			gradient: [`#${color}`, "#ffffff", "#000000"],
		}),
	}),
};
