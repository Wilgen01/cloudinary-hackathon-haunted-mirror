import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'test',
        loadComponent: () => import('./character/character.component').then(m => m.CharacterComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'upload',
        loadComponent: () => import('./upload-image/upload-image.component').then(m => m.UploadImageComponent)
    },
    {
        path: 'game/:folder/:file',
        loadComponent: () => import('./game/game.component').then(m => m.GameComponent)
    },
    {
        path: 'tyc',
        loadComponent: () => import('./terminos-y-condiciones/terminos-y-condiciones.component').then(m => m.TerminosYCondicionesComponent)
    }
];
