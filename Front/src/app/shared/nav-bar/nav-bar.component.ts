import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../features/auth/services/auth.service';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../features/cart/services/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, MenuModule, RouterModule, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  readonly cartCount = this.cartService.cartCount;

  get isLogged() {
    return this.authService.isLoggedIn();
  } 
  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logOut();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showMenu = false;
    }
  }
}
