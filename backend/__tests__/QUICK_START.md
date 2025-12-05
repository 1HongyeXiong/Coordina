# Quick Start Guide - Azure Endpoint Tests

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run only Azure integration tests
npm test -- azure-endpoints.integration.test.ts

# Run in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

## ⚙️ Configuration

### Environment Variables

Set these before running tests:

```bash
# Custom Azure backend URL
export AZURE_BACKEND_URL=https://your-backend.azurewebsites.net

# Custom timeout (milliseconds)
export TEST_TIMEOUT=60000

# Run tests
npm test
```

Or inline:

```bash
AZURE_BACKEND_URL=https://staging.azurewebsites.net npm test
```

## 📋 Test Categories

### 1. Root Endpoint Tests
- API information endpoint
- Health check endpoint
- 404 error handling

### 2. User Endpoint Tests
- Get all users
- Get user by ID
- Create user
- Sync Microsoft ID
- Validation and error cases

### 3. Eventtime Endpoint Tests
- Get all eventtimes
- Get eventtime by ID
- Create eventtime
- Date validation

### 4. Event Endpoint Tests
- Get all events (with filtering)
- Get event by ID
- Create event
- Status validation
- Participants handling

### 5. Authentication Tests
- Sign in
- Sign out
- Redirect handling

### 6. Error Handling
- Invalid data
- Missing fields
- Duplicate entries
- Malformed requests

### 7. Edge Cases
- Special characters
- Long strings
- Concurrent requests

### 8. Performance
- Response time
- Sequential operations

## 🔍 Example Test Output

```
PASS  __tests__/azure-endpoints.integration.test.ts
  Coordina API - Azure Endpoint Integration Tests
    Root Endpoint Tests
      ✓ GET / should return API information (5234 ms)
      ✓ GET /test should return success message (1234 ms)
      ✓ GET /unknown-route should return 404 (567 ms)
    User Endpoint Tests
      ✓ should retrieve all users successfully (2341 ms)
      ✓ should create a new user with valid data (3456 ms)
      ...
```

## 🛠️ Troubleshooting

### Tests Timing Out

```bash
# Increase timeout
TEST_TIMEOUT=60000 npm test
```

### Azure Endpoint Not Reachable

```bash
# Check connectivity
curl https://coordina-backend.azurewebsites.net/test

# Use different endpoint
AZURE_BACKEND_URL=https://staging.azurewebsites.net npm test
```

### Duplicate Entry Errors

- Tests automatically clean up after completion
- If tests are interrupted, manually clean up test data
- Ensure unique test data generation

## 📝 Writing New Tests

```typescript
import { createTestUser } from './test-helpers';
import TestConfig from './test-config';

it('should test something', async () => {
  const userData = createTestUser();
  const response = await axios.post(
    `${TestConfig.API_BASE_URL}/users`,
    userData
  );
  
  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('_id');
});
```

## 📚 More Information

- See `README.md` for detailed documentation
- See `TEST_SUMMARY.md` for complete test coverage
- See `test-helpers.ts` for available utilities
