import type { Request, Response } from "express";
import type { RegisterDto, LoginDto } from "../dtos/auth.dto.js";
import { register, login, refreshTokens } from "../services/auth.service.js";
import { successResponse } from "../utils/response.util.js";

export const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, password } = req.body as RegisterDto;

  const { user, accessToken, refreshToken } = await register({ fullname, email, password });

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  res.json(successResponse({ 
    user: { id: user._id, fullname: user.fullname, email: user.email }, 
    accessToken 
  }, "User registered successfully"));
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDto;

  const { user, accessToken, refreshToken } = await login({ email, password });

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  res.json(successResponse({ 
    user: { id: user._id, fullname: user.fullname, email: user.email }, 
    accessToken 
  }, "Login successful"));
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshTokenCookie);

  res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: false });
  res.json(successResponse({ accessToken }, "Token refreshed"));
};
