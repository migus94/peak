import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ShowcaseComponent } from './features/showcase/showcase.component';
import { ProductGridComponent } from './features/products/product-grid/product-grid.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
        path: '', 
        component: ShowcaseComponent,
        children: [
            {path: '', component: ProductGridComponent},
        ]
    },
    {path: '**', redirectTo: ''}
];
