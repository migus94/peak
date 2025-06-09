import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MenubarModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  items: MenuItem[] = [];

  private auth: AuthService = inject(AuthService);

  private buildMenu() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Productos',
        icon: 'pi pi-tags',
        routerLink: ['/products']
      },
      {
        label: 'Carrito',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/cart']
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: ['/user'],
        visible: this.auth.isLoggedIn(),
        items: [
          {
            label: 'Mi cuenta',
            icon: 'pi pi-cog',
            routerLink: ['/profile']
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sing-out',
            comand: () => this.auth.logOut()
          }
        ]
      },
      {
        label: 'Login',
        icon: 'pi pi-sing-in',
        routerLink: ['/login'],
        visible: !this.auth.isLoggedIn()
      },
      {
        label: 'Registro',
        icon: 'pi pi-user-plus',
        routerLink: ['/register'],
        visible: !this.auth.isLoggedIn()
      }
    ]
  }
}
