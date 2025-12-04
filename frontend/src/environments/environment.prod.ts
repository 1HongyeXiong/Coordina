export const environment = {
  production: true,

  msalConfig: {
    auth: {
      clientId: '09d56e44-fd10-487e-9317-28eb66999f9e',
      authority: 'https://login.microsoftonline.com/4de56939-a91e-4cd1-8285-e289916648ff',
      redirectUri: 'https://coordina-frontend.azurewebsites.net',
      postLogoutRedirectUri: 'https://coordina-frontend.azurewebsites.net'
    }
  },

  apiConfig: {
    baseUrl: 'https://coordina-backend.azurewebsites.net/api',
    scopes: ['user.read']
  }
};
