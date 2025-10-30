import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Todo } from './todo/todo';

export const routes: Routes = [
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: 'users', component: Users },
    { path: 'todos', component: Todo },
];
