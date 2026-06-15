import { Hono } from "hono";
import type { Context } from "hono";

const deployWebhookRouter = new Hono();

/**
 * POST /api/deploy-webhook
 *
 * Triggers an external deploy/rebuild webhook after publishing content.
 * Auth uses MICROPUB_TOKEN as a shared secret (Bearer token).
 *
 * Response codes:
 *   200 — webhook POST succeeded
 *   401 — missing or invalid token
 *   501 — DEPLOY_WEBHOOK_URL not configured
 *   502 — external webhook request failed
 */
deployWebhookRouter.post("/", async (c: Context) => {
	// Authenticate via MICROPUB_TOKEN as shared secret
	const authHeader = c.req.header("Authorization") || "";
	const token = authHeader.replace(/^Bearer\s+/i, "");

	if (!token || token !== process.env.MICROPUB_TOKEN) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	// Check that the webhook URL is configured
	const webhookUrl = process.env.DEPLOY_WEBHOOK_URL;
	if (!webhookUrl) {
		return c.json(
			{ error: "Deploy webhook not configured — set DEPLOY_WEBHOOK_URL" },
			501,
		);
	}

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			return c.json({
				success: false,
				status: response.status,
				statusText: response.statusText,
			});
		}

		return c.json({ success: true });
	} catch (err) {
		console.error("[deploy-webhook] POST failed:", err);
		return c.json({ success: false, error: "Request failed" }, 502);
	}
});

export { deployWebhookRouter };
