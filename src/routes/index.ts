import { Router } from "express";
import { health } from "../controllers/health.controller.js";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

const router = Router();

router.use("/auth/v1", authRouter);
router.use("/user/v1", userRouter);
router.use("/health/v1", health);

export default router;