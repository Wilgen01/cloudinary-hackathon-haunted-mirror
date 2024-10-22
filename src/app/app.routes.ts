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
        children: [
            {
                path: '',
                loadComponent: () => import('./game/game.component').then(m => m.GameComponent)
            },
            {
                path: 'result',
                loadComponent: () => import('./game/components/result/result.component').then(m => m.ResultComponent)
            }
        ]
    },
    {
        path: 'tyc',
        loadComponent: () => import('./terminos-y-condiciones/terminos-y-condiciones.component').then(m => m.TerminosYCondicionesComponent)
    },
    {
        path: 'gallery',
        loadComponent: () => import('./gallery/gallery.component').then(m => m.GalleryComponent)
    },
    {
        path: 'liberar/:folder/:file',
        loadComponent: () => import('./liberar/liberar.component').then(m => m.LiberarComponent)
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
