import express from "express";
import type { Express  } from "express";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(globalErrorHandler);

export default app;