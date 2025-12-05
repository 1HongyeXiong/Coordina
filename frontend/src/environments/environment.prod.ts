export const environment = {
  production: true,

  msalConfig: {
    auth: {
      clientId: '09d56e44-fd10-487e-9317-28eb66999f9e',
      authority: 'https://login.microsoftonline.com/4de56939-a91e-4cd1-8285-e289916648ff',
      redirectUri: 'https://lemon-smoke-0c9095b1e.3.azurestaticapps.net',
      postLogoutRedirectUri: 'https://lemon-smoke-0c9095b1e.3.azurestaticapps.net'
    }
  },

  apiConfig: {
    baseUrl: 'https://coordina-backend-dkfzh7g8a4c7fbec.westus2-01.azurewebsites.net/api',
    scopes: ['user.read']
  }
};

