import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { TokenPayloadDto } from "../dtos/auth.dto.js";
import { config } from "../config/env.config.js";
import AppError from "./app-error.util.js";

export const generateAccessToken = (payload: TokenPayloadDto) => {
    if (!config.jwtAccessSecret) {
        throw new AppError("JWT secret is not defined", 400);
    }

    const options: SignOptions = {
        expiresIn: config.accessTokenExpiry,
    };

    return jwt.sign({ ...payload }, config.jwtAccessSecret, options);
}

export const generateRefreshToken = (payload: TokenPayloadDto) => {
  if(!config.jwtRefreshSecret){
    throw new AppError("JWT secret is not defined", 400);
  }

  const options: SignOptions = {
    expiresIn : config.refreshTokenExpiry,
  };

  return jwt.sign({...payload}, config.jwtRefreshSecret, options);
}

export const verifyToken = <T>(token:string, secret: string): T => {
  return jwt.verify(token, secret) as T;
}