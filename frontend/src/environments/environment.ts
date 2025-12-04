// WARNING: Do not commit sensitive client credentials to version control.
// The clientId, authority, and tenant ID below are example values for local development only.
// For production, use environment variable substitution during build and do not hardcode these values.
// See README for instructions on configuring environment variables for deployment.
export const environment = {
  production: false,

  // Azure AD / Microsoft Entra ID Configuration
  msalConfig: {
    auth: {
      // TODO: Replace with environment variables for production deployments.
      // Example: process.env['NG_APP_CLIENT_ID'] || 'example-client-id'
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
