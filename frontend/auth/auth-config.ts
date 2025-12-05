// MSAL Configuration for Microsoft SSO
import { 
  IPublicClientApplication, 
  PublicClientApplication, 
  InteractionType, 
  BrowserCacheLocation, 
  LogLevel 
} from "@azure/msal-browser";
import { 
  MsalInterceptorConfiguration, 
  MsalGuardConfiguration 
} from "@azure/msal-angular";
import { environment } from "../src/environments/environment";

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

// Create and initialize MSAL instance
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: environment.msalConfig.auth.clientId,
    authority: environment.msalConfig.auth.authority,
    redirectUri: environment.msalConfig.auth.redirectUri,
    postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    allowPlatformBroker: false,
    loggerOptions: {
      loggerCallback,
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
});

// Initialize MSAL
msalInstance.initialize().then(() => {
  // Handle redirect after login
  msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
      msalInstance.setActiveAccount(response.account);
    }
  });
});

export function MSALInstanceFactory(): IPublicClientApplication {
  return msalInstance;
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Protect your backend API
  protectedResourceMap.set(environment.apiConfig.baseUrl + "/*", environment.apiConfig.scopes);
  // Microsoft Graph API (if needed)
  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ["user.read"],
    },
    loginFailedRoute: "/login-failed",
  };
}