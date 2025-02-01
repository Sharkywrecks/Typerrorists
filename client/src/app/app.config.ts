import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/loading.interceptors';
import { jwtAuthInterceptor } from './core/interceptors/jwt.interceptor';
import { API_BASE_URL, Client } from './client.api';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), 
    withInterceptors([errorInterceptor, loadingInterceptor, jwtAuthInterceptor])),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {
      provide: API_BASE_URL,
      useValue: environment.apiUrl,
    },
    Client
  ],
};
