import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { LoginRequest, LoginResponse, RefreshRequest, RegisterRequest, RegisterResponse } from '../../../core/interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_KEY = 'refreshToken';
  private _token = signal<string | null>(this.getToken());
  
  private readonly apiBase = '/api';
  private authRoutue = '/auth';
  private loginRoutue = '/login';
  private singUpRoutue = '/signup';
  private refreshRoutue = '/refresh';
  private usersRoutue = '/users';
  private passwordRoutue = '/password';

  isLoggedIn = computed(()=> !!this._token());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiBase}${this.authRoutue}${this.loginRoutue}`, {email, password})
      .pipe(
        tap(({ accessToken, refreshToken, payload }) => {
          this.setToken(accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userRole', payload?.roles ?? 'USER');
          localStorage.setItem('userId', String(payload?.publicId ?? ''))
        })
      );
  }

  register(payload: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.apiBase}${this.authRoutue}${this.singUpRoutue}`, payload);
  }

  changePassword(id: number ,oldPassword: string, newPassword: string) {
    const payload = { oldPassword, newPassword };
    return this.http.patch(`${this.apiBase}${this.usersRoutue}/${id}${this.passwordRoutue}`, payload);
  }

  refreshToken(body: RefreshRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiBase}${this.authRoutue}${this.refreshRoutue}`, body)
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          this.setToken(accessToken);
          localStorage.setItem('refreshToken', refreshToken)
        })
      );
  }
  
  setToken(token: string) {
    this._token.set(token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  clearToken(): void {
    this._token.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem('userRole');
  }

  logOut(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
