// Development environment configuration
export const environment = {
  production: false,
  
  // Azure AD / Microsoft Entra ID Configuration
  msalConfig: {
    auth: {
      clientId: '09d56e44-fd10-487e-9317-28eb66999f9e',
      authority: 'https://login.microsoftonline.com/4de56939-a91e-4cd1-8285-e289916648ff',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    }
  },
  
  // API Configuration
  apiConfig: {
    baseUrl: 'http://localhost:5001/api',
    scopes: ['user.read'] // Microsoft Graph scopes if needed
  }
};
