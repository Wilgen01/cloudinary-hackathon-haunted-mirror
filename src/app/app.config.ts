import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(), 
    importProvidersFrom(NgxSpinnerModule.forRoot({ type: 'ball-pulse' })),
    provideAnimations(),
    provideHotToastConfig(), provideFirebaseApp(() => initializeApp({"projectId":"haunted-mirror","appId":"1:543890691789:web:eae8e0b72484c8fd0b3b84","storageBucket":"haunted-mirror.appspot.com","apiKey":"AIzaSyBFou4IIChknaOK0MVPDR4IEeuKN16On_0","authDomain":"haunted-mirror.firebaseapp.com","messagingSenderId":"543890691789"})), provideFirestore(() => getFirestore())
  ]
};
