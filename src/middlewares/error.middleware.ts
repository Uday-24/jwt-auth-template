import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.util.js";

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        succss: false,
        message: err.message || "Internal Server Error",
    });
}