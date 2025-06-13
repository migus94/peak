import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ShowcaseComponent } from './features/showcase/showcase.component';
import { ProductGridComponent } from './features/products/product-grid/product-grid.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
        path: '', 
        component: ShowcaseComponent,
        children: [
            {path: '', component: ProductGridComponent},
            {path: 'product/:id', component: ProductDetailComponent},
            {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
            {path: 'admin/users', component: UserManagementComponent, canActivate: [AuthGuard, AdminGuard]},
            {path: 'admin/products', component: UserManagementComponent, canActivate: [AuthGuard, AdminGuard]},
        ]
    },
    {path: '**', redirectTo: ''}
];
