import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {};
  canActivate(): boolean | UrlTree {
      return this.authService.isLoggedIn() 
        ? true 
        : this.router.parseUrl('/login')
  }
};
