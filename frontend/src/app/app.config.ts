import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optional: log errors globally
    provideBrowserGlobalErrorListeners(),

    // Optional: zone.js change detection with event coalescing
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router setup for SPA
    provideRouter(routes)
  ]
};