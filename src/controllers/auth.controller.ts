import type { Request, Response } from "express";
import type { RegisterDto, LoginDto } from "../dtos/auth.dto.js";
import { register, login, refreshTokens, logout } from "../services/auth.service.js";
import { successResponse } from "../utils/response.util.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/v1/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response) => {
    const { fullname, email, password } = req.body as RegisterDto;

    const { user, accessToken, refreshToken } = await register({ fullname, email, password });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.json(successResponse({
        user: { id: user._id, fullname: user.fullname, email: user.email },
        accessToken
    }, "User registered successfully"));
};

/**
 * @desc Login user and get access & refresh tokens
 * @route POST /api/auth/v1/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginDto;

    const { user, accessToken, refreshToken } = await login({ email, password });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.json(successResponse({
        user: { id: user._id, fullname: user.fullname, email: user.email },
        accessToken
    }, "Login successful"));
};

/**
 * @desc Get a new access token using refresh token
 * @route POST /api/auth/v1/refresh
 * @access Public
 */
export const refreshToken = async (req: Request, res: Response) => {
    const refreshTokenCookie = req.cookies.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshTokenCookie);

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: false });
    res.json(successResponse({ accessToken }, "Token refreshed"));
};

/**
 * @desc Logout user and invalidate refresh token
 * @route POST /api/auth/v1/logout
 * @access Private
 */
export const logoutUser = async (req: Request, res: Response) => {
    const refreshTokenCookie = req.cookies.refreshToken;

    await logout(refreshTokenCookie);

    // Clear the cookie
    res.clearCookie("refreshToken", { httpOnly: true, secure: false });
    
    res.json(successResponse(null, "Logged out successfully"));
};