export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse{
    accessToken: string,
    refreshToken: string,
    payload?: {
        roles: 'USER' | 'ADMIN'
    }
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