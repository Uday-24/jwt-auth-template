export interface RegisterDto {
    fullname: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface TokenPayloadDto {
    id: string;
    email: string;
}