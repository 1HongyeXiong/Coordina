# How to Run Tests - Step by Step Guide

## Prerequisites

1. Make sure you're in the backend directory:
   ```bash
   cd backend
   ```

2. Ensure dependencies are installed:
   ```bash
   npm install
   ```

## Running Tests

### Option 1: Run All Tests
```bash
npm test
```
This runs all test files including:
- Unit tests (userController, eventController, etc.)
- Integration tests (routes.integration.test.ts)
- Azure endpoint tests (azure-endpoints.integration.test.ts)

### Option 2: Run Only Azure Endpoint Tests
```bash
npm run test:azure
```
This runs only the Azure endpoint integration tests.

### Option 3: Run Specific Test File
```bash
npm test -- azure-endpoints.integration.test.ts
```

### Option 4: Run Tests in Watch Mode
```bash
npm run test:watch
```
Tests will re-run automatically when files change.

### Option 5: Run Tests with Coverage Report
```bash
npm run test:coverage
```
Generates a coverage report showing which code is tested.

## Using Environment Variables

### Custom Azure Backend URL
```bash
AZURE_BACKEND_URL=https://your-backend.azurewebsites.net npm run test:azure
```

### Custom Timeout
```bash
TEST_TIMEOUT=60000 npm run test:azure
```

### Multiple Environment Variables
```bash
AZURE_BACKEND_URL=https://staging.azurewebsites.net TEST_TIMEOUT=60000 npm run test:azure
```

## Expected Output

When tests run successfully, you'll see output like:

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

## Troubleshooting

### Tests Fail with "Cannot find module"
```bash
# Reinstall dependencies
npm install
```

### Tests Timeout
```bash
# Increase timeout
TEST_TIMEOUT=60000 npm run test:azure
```

### Azure Endpoint Not Reachable
```bash
# Check if endpoint is accessible
curl https://coordina-backend.azurewebsites.net/test

# Or use a different endpoint
AZURE_BACKEND_URL=https://staging.azurewebsites.net npm run test:azure
```

### TypeScript Errors
```bash
# Make sure TypeScript is properly configured
npx tsc --noEmit
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:azure` | Run Azure endpoint tests only |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm test -- <filename>` | Run specific test file |

## Next Steps

- See `README.md` for detailed documentation
- See `QUICK_START.md` for quick reference
- See `TEST_SUMMARY.md` for test coverage details
