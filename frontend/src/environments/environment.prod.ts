// Production environment configuration
export const environment = {
  production: true,
  
  // Azure AD / Microsoft Entra ID Configuration
  msalConfig: {
    auth: {
      clientId: '09d56e44-fd10-487e-9317-28eb66999f9e',
      authority: 'https://login.microsoftonline.com/4de56939-a91e-4cd1-8285-e289916648ff',
      redirectUri: 'https://YOUR-APP-NAME.azurewebsites.net', // TODO: Update when deployed
      postLogoutRedirectUri: 'https://YOUR-APP-NAME.azurewebsites.net' // TODO: Update when deployed
    }
  },
  
  // API Configuration
  apiConfig: {
    baseUrl: 'https://YOUR-API-NAME.azurewebsites.net/api', // TODO: Update when deployed
    scopes: ['user.read'] // Microsoft Graph scopes if needed
  }
};
