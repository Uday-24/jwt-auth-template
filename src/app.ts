import express from "express";
import type { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Health is good" });
})

app.use(express.json());
app.use(cookieParser());

export default app;