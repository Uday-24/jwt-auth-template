import crypto from "crypto";
import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import type { IUser } from "../models/user.model.js";
import { sendEmail } from "../utils/send-email.util.js";
import AppError from "../utils/app-error.util.js";

/**
 * @desc Forgot password - send password reset link to email
 * @route POST /api/user/v1/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email }: { email?: string } = req.body;

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const user: IUser | null = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Save hashed token to DB with expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `Click this link to reset your password:\n\n${resetURL}\n\nThis link is valid for 15 minutes.`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Password reset link sent to email" });
};

/**
 * @desc Reset password using token
 * @route POST /api/user/v1/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { newPassword }: { newPassword?: string } = req.body;

    if (!token) {
        throw new AppError("Token is required", 400);
    }

    if (!newPassword) {
        throw new AppError("New password is required", 400);
    }

    // Hash the token and find matching user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user: IUser | null = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
        throw new AppError("Token is invalid or has expired", 400);
    }

    // Set new password and clear reset fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
};
