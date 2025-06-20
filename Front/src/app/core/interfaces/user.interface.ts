export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
}