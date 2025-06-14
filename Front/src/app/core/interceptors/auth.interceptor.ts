import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { LoginRequest, LoginResponse, RefreshRequest } from '../interfaces/auth.interface';
import { enviroment } from '../../../enviroment/enviroment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'accesToken';
  private readonly REFRESH_KEY = 'refreshToken';

  private authRoutue = '/auth';
  private loginRoutue = '/login';
  private singUpRoutue = '/singUp';
  private refreshRoutue = '/refresh';
  
  intercept(
    req: HttpRequest<unknown>, 
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    let cloned = req
    if (token) {
      cloned = req.clone({
        setHeaders: {Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(cloned).pipe(
      catchError(e => {
        if(e instanceof HttpErrorResponse && e.status === 401){
          const refreshToken = localStorage.getItem(this.REFRESH_KEY);
          if (!refreshToken) {
            this.authService.logOut();
            return throwError(() => e);
          }
          const body: RefreshRequest = { refreshToken }
          return this.http.post<LoginResponse>(`${enviroment.apiUrl}${this.authRoutue}${this.refreshRoutue}`, body)
            .pipe(
              switchMap( res => {
                this.authService.setToken(res.accessToken);
                this.authService.setToken(res.refreshToken);
                localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`
                  }
                });
                return next.handle(retryReq);
              }),
              catchError ( () => {
                this.authService.logOut();
                return throwError(() => e)
              })
            )
        }
        return throwError(() => e)
      })
    )
  }
};
