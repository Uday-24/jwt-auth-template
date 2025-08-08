import express from "express";
import type { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Health is good" });
})
app.use("/api/auth/v1", authRoutes);
app.use("/api/user/v1", userRoutes);
app.use(errorHandler);

export default app;