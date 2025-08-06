import express from "express";
import type { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

export default app;