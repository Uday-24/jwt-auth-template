// middlewares/auth.middleware.ts
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.util.js";
import type { TokenPayloadDto } from "../dtos/auth.dto.js";
import { config } from "../config/env.config.js";

export const authMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Authorization token missing", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token!, config.jwtAccessSecret!) as TokenPayloadDto;
        (req as any).user = decoded; // attach decoded user to request
        next();
    } catch (err) {
        return next(new AppError("Invalid or expired token", 401));
    }
};
