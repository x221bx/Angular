import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', loadComponent: () => import('./products/products').then(m => m.Products) },
    { path: 'product/:id', loadComponent: () => import('./product-details/product-details').then(m => m.ProductDetails) },
    { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
    { path: 'cart', loadComponent: () => import('./cart/cart').then(m => m.Cart) },
    { path: '**', loadComponent: () => import('./not-found/not-found').then(m => m.NotFound) },
];
