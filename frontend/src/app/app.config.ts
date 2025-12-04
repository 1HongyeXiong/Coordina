import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from "@angular/common/http";
import { 
  MsalInterceptor, 
  MSAL_INSTANCE, 
  MSAL_GUARD_CONFIG, 
  MSAL_INTERCEPTOR_CONFIG, 
  MsalService, 
  MsalGuard, 
  MsalBroadcastService 
} from "@azure/msal-angular";
import { MSALInstanceFactory, MSALInterceptorConfigFactory, MSALGuardConfigFactory } from '../../auth/auth-config';

export const appConfig: ApplicationConfig = {
  providers: [
    // Error logging
    provideBrowserGlobalErrorListeners(),
    
    // Zone.js change detection
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router
    provideRouter(routes),
    
    // HTTP Client with interceptors
    provideHttpClient(withInterceptorsFromDi()),
    
    // MSAL HTTP Interceptor - attaches tokens to API calls
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    
    // MSAL Instance
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    
    // MSAL Guard Configuration
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    
    // MSAL Interceptor Configuration
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    
    // MSAL Services
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ]
};