import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiry: 900,
    refreshTokenExpiry: 7 * 24 * 60 * 60,
}