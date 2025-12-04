// Production environment configuration
export const environment = {
  production: true,
  
  // Azure AD / Microsoft Entra ID Configuration
  msalConfig: {
    auth: {
      clientId: '09d56e44-fd10-487e-9317-28eb66999f9e',
      authority: 'https://login.microsoftonline.com/4de56939-a91e-4cd1-8285-e289916648ff',
      redirectUri: '${PRODUCTION_URL}',
      postLogoutRedirectUri: '${PRODUCTION_URL}'
    }
  },

  // API Configuration
  apiConfig: {
    baseUrl: '${PRODUCTION_API_URL}',
    scopes: ['user.read'] // Microsoft Graph scopes if needed
  }
};
