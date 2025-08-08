import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logoutUser);

export default router;