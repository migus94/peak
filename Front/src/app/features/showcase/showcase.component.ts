import { CommonModule } from '@angular/common';
import { Component, inject, provideZoneChangeDetection } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../auth/services/auth.service';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { SideNavComponent } from '../../shared/side-nav/side-nav.component';
import { MyAccountComponent } from '../auth/my-account/my-account.component';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBarComponent,
    SideNavComponent,
    MyAccountComponent 
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  showMyAccount = false;
}
