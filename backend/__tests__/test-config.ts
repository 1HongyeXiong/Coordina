/**
 * Test Configuration for Azure Endpoint Testing
 * 
 * This file provides configuration for testing against Azure-deployed endpoints.
 * Set environment variables to override defaults:
 * - AZURE_BACKEND_URL: Base URL for Azure backend (default: https://coordina-backend-dkfzh7g8a4c7fbec.westus2-01.azurewebsites.net)
 * - AZURE_FRONTEND_URL: Base URL for Azure frontend (default: https://coordina-frontend.azurewebsites.net)
 * - TEST_TIMEOUT: Timeout for test requests in milliseconds (default: 30000)
 */

export const TestConfig = {
  // Azure Backend Configuration
  AZURE_BACKEND_URL: process.env.AZURE_BACKEND_URL || 'https://coordina-backend-dkfzh7g8a4c7fbec.westus2-01.azurewebsites.net',
  AZURE_FRONTEND_URL: process.env.AZURE_FRONTEND_URL || 'https://coordina-frontend.azurewebsites.net',
  
  // API Endpoints
  get API_BASE_URL() {
    return `${this.AZURE_BACKEND_URL}/api`;
  },
  
  get AUTH_BASE_URL() {
    return `${this.AZURE_BACKEND_URL}/auth`;
  },
  
  // Test Configuration
  TEST_TIMEOUT: parseInt(process.env.TEST_TIMEOUT || '30000', 10),
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '3', 10),
  RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '1000', 10),
  
  // Test Data Configuration
  TEST_DATA: {
    USER_PREFIX: 'test-user',
    EVENT_PREFIX: 'test-event',
    EVENTTIME_PREFIX: 'test-eventtime',
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_EMAIL_LENGTH: 5,
    MAX_EMAIL_LENGTH: 254,
    MIN_NAME_LENGTH: 1,
    MAX_NAME_LENGTH: 100,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
  },
};

export default TestConfig;
