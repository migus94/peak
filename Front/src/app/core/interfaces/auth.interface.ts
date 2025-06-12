export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse{
    accesToken: string,
    refreshToken: string
}

export interface RegisterRequest {
    email: string,
    password: string,
    name: string
}

export interface RegisterResponse {
    id: number,
    name: string,
    email: string,
    rol: 'USER' | 'ADMIN'
}

export interface RefreshRequest {
    refreshToken: string
}