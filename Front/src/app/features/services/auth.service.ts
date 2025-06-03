import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshRequest, RegisterRequest } from '../../core/interfaces/auth.interface';
import { enviroment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accesToken';
  private readonly REFRESH_KEY = 'refreshToken';
  
  private readonly API_BASE = `${enviroment.apiUrl}`;
  private authRoutue = '/auth';
  private loginRoutue = '/login';
  private singUpRoutue = '/singUp';
  private refreshRoutue = '/refresh';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(payload: LoginRequest, password: any) {
    return this.http
      .post<LoginResponse>(`${this.API_BASE}${this.authRoutue}${this.loginRoutue}`, payload)
      .pipe(
        tap(({ accesToken, refreshToken }) => {
          localStorage.setItem('accesToken', accesToken),
          localStorage.setItem('refreshToken', refreshToken)
        })
      );
  }

  register(payload: RegisterRequest) {
    return this.http.post<RegisterRequest>(`${this.API_BASE}${this.authRoutue}${this.singUpRoutue}`, payload);
  }

  refreshToken(body: RefreshRequest) {
    return this.http
      .post<LoginResponse>(`${this.API_BASE}${this.authRoutue}${this.refreshRoutue}`, body)
      .pipe(
        tap(({ accesToken, refreshToken }) => {
          localStorage.setItem('accesToken', accesToken),
          localStorage.setItem('refreshToken', refreshToken)
        })
      );
  }
  
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  logOut(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
