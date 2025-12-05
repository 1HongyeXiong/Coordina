# Coordina API Test Suite

This directory contains comprehensive test suites for the Coordina API, including TDD (Test-Driven Development) tests for Azure-deployed endpoints.

## Test Files

### Integration Tests

- **`azure-endpoints.integration.test.ts`** - Comprehensive integration tests against Azure-deployed API endpoints
- **`routes.integration.test.ts`** - Local integration tests for API routes
- **`userController.test.ts`** - Unit tests for user controller
- **`eventController.test.ts`** - Unit tests for event controller
- **`eventtimeController.test.ts`** - Unit tests for eventtime controller

### Test Utilities

- **`test-config.ts`** - Configuration for Azure endpoint testing
- **`test-helpers.ts`** - Reusable helper functions for test data creation and validation

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Azure Endpoint Integration Tests
```bash
npm test -- azure-endpoints.integration.test.ts
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- userController.test.ts
```

## Environment Variables

You can configure the test suite using environment variables:

- **`AZURE_BACKEND_URL`** - Base URL for Azure backend (default: `https://coordina-backend.azurewebsites.net`)
- **`AZURE_FRONTEND_URL`** - Base URL for Azure frontend (default: `https://coordina-frontend.azurewebsites.net`)
- **`TEST_TIMEOUT`** - Timeout for test requests in milliseconds (default: `30000`)
- **`RETRY_ATTEMPTS`** - Number of retry attempts for failed requests (default: `3`)
- **`RETRY_DELAY`** - Delay between retries in milliseconds (default: `1000`)

### Example
```bash
AZURE_BACKEND_URL=https://staging-backend.azurewebsites.net TEST_TIMEOUT=60000 npm test
```

## Test Coverage

The Azure endpoint integration test suite covers:

### User Endpoints
- ✅ GET `/api/users` - Retrieve all users
- ✅ GET `/api/users/:id` - Retrieve user by ID
- ✅ POST `/api/users` - Create new user
- ✅ POST `/api/users/sync` - Sync Microsoft ID

### Event Endpoints
- ✅ GET `/api/events` - Retrieve all events (with optional userId filter)
- ✅ GET `/api/events/:id` - Retrieve event by ID
- ✅ POST `/api/events` - Create new event

### Eventtime Endpoints
- ✅ GET `/api/eventtimes` - Retrieve all eventtimes
- ✅ GET `/api/eventtimes/:id` - Retrieve eventtime by ID
- ✅ POST `/api/eventtimes` - Create new eventtime

### Authentication Endpoints
- ✅ GET `/auth/signin` - Sign in
- ✅ GET `/auth/signout` - Sign out
- ✅ POST `/auth/redirect` - Handle redirect

### Root Endpoints
- ✅ GET `/` - API information
- ✅ GET `/test` - Health check

### Error Handling
- ✅ 404 errors for non-existent resources
- ✅ 400 errors for invalid data
- ✅ 500 errors for server issues
- ✅ Validation errors
- ✅ Duplicate entry errors
- ✅ Malformed request handling

### Edge Cases
- ✅ Concurrent requests
- ✅ Special characters in data
- ✅ Extremely long strings
- ✅ Invalid date ranges
- ✅ Missing required fields

## Test Data Management

The test suite automatically:
- Creates unique test data for each test
- Tracks all created resources (users, events, eventtimes)
- Cleans up all test resources after tests complete
- Uses timestamp-based unique identifiers to avoid conflicts

## Writing New Tests

### Using Test Helpers

```typescript
import { createTestUser, createTestEvent, validateUserData } from './test-helpers';
import TestConfig from './test-config';

describe('My New Test Suite', () => {
  it('should test something', async () => {
    const userData = createTestUser({ name: 'Custom Name' });
    const response = await axios.post(`${TestConfig.API_BASE_URL}/users`, userData);
    
    expect(response.status).toBe(201);
    expect(validateUserData(response.data)).toBe(true);
  });
});
```

### Test Structure

1. **Setup** - Create necessary test data
2. **Execute** - Make API calls
3. **Assert** - Verify responses
4. **Cleanup** - Remove test data (handled automatically)

## Best Practices

1. **Use Test Helpers** - Always use helper functions for creating test data
2. **Clean Up** - Add created resource IDs to cleanup arrays
3. **Validate Responses** - Use validation helpers to verify data structure
4. **Handle Errors** - Test both success and error cases
5. **Use Timeouts** - Set appropriate timeouts for Azure requests
6. **Unique Data** - Always use unique identifiers to avoid conflicts

## Troubleshooting

### Tests Failing Due to Network Issues

If tests fail due to network latency or Azure endpoint unavailability:
- Increase `TEST_TIMEOUT` environment variable
- Check Azure endpoint is accessible: `curl https://coordina-backend.azurewebsites.net/test`
- Verify network connectivity

### Tests Failing Due to Duplicate Data

If tests fail due to duplicate entries:
- Ensure test data uses unique identifiers (timestamps)
- Check that cleanup is running properly
- Verify no other tests are running concurrently

### Authentication Tests Failing

Authentication tests may fail if:
- Azure AD configuration has changed
- Redirect URLs are not properly configured
- Session handling is not working correctly

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Azure Integration Tests
  env:
    AZURE_BACKEND_URL: ${{ secrets.AZURE_BACKEND_URL }}
    TEST_TIMEOUT: 60000
  run: npm test -- azure-endpoints.integration.test.ts
```

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use test helpers for data creation
3. Add cleanup for any created resources
4. Update this README with new test coverage
5. Ensure tests pass locally before committing
