import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'test',
        loadComponent: () => import('./character/character.component').then(m => m.CharacterComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    }
];
