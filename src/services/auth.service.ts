import { User } from "../models/user.model.js";
import AppError from "../utils/app-error.util.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/token.util.js";
import type { RegisterDto, LoginDto, TokenPayloadDto } from "../dtos/auth.dto.js";
import { config } from "../config/env.config.js";

export const register = async ({ fullname, email, password }: RegisterDto) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("Email already registered", 400);

    const user = new User({ fullname, email, password });
    await user.save();

    const payload: TokenPayloadDto = { id: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
}

export const login = async ({ email, password }: LoginDto) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid Credentials", 401);
    }

    const payload: TokenPayloadDto = { id: user._id.toString(), email: user.email };
    const accessToken: string = generateAccessToken(payload);
    const refreshToken: string = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
}

export const refreshTokens = async (token: string) => {
    if (!token) throw new AppError("Refresh token required", 401);

    const decoded = verifyToken<TokenPayloadDto>(token, config.jwtRefreshSecret!);

    const user = await User.findById(decoded.id);
    if (!user || token !== user.refreshToken) {
        throw new AppError("Invalid refresh token", 403);
    }

    const payload: TokenPayloadDto = { id: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
}

export const logout = async (refreshToken: string) => {
    // Example: if refresh tokens are stored in the user collection
    const user = await User.findOne({ refreshToken });
    if (user) {
        user.refreshToken = null; // clear from DB
        await user.save();
    }

    return true;
};