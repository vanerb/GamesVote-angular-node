import 'zone.js';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
import { demoApiInterceptor } from './app/services/demo-api.interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([demoApiInterceptor])),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(),
  ],
}).catch(err => console.error(err));
