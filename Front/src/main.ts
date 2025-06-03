import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
