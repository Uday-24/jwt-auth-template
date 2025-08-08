import express from "express";
const router = express.Router();
import { forgotPassword, resetPassword } from "../controllers/user.controller.js";

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;