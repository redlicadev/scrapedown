import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scrape } from "./scrape";
import { env } from "hono/adapter";

const app = new Hono();

app.get(
    "/",
    zValidator(
        "query",
        z.object({
            url: z.string().url(),
            key: z.string(),
        })
    ),
    async (c) => {
        const query = c.req.valid("query");

        const url = query["url"];
        const key = query["key"];

        const { API_KEY } = env<{ API_KEY: string }>(c);

        if (key !== API_KEY) {
            return c.json({ page: null, error: "Invalid API key" });
        }

        try {
            const page = await scrape({ url });

            return c.json({ page });
        } catch (e) {
            if (e instanceof Error) {
                return c.json({ page: null, error: e.message });
            } else {
                return c.json({
                    page: null,
                    error: "An unknown error occurred",
                });
            }
        }
    }
);

export default app;
