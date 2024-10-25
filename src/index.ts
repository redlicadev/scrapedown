import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scrape } from "./scrape";

const app = new Hono();

app.get(
    "/",
    zValidator(
        "query",
        z.object({
            url: z.string().url(),
        })
    ),
    async (c) => {
        const query = c.req.valid("query");

        const url = query["url"];

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
