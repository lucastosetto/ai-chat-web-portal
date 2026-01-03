# API Service Layer Tests

This directory contains tests for the API service layer implementation.

## Running Tests

### Run all tests once
```bash
pnpm test:run
```

### Run tests in watch mode
```bash
pnpm test
```

### Run tests with UI
```bash
pnpm test:ui
```

## Test Coverage

### Session Tests (`session.test.ts`)
- Token storage and retrieval from cookies
- Token expiration handling
- Session cleanup

### API Client Tests (`api-client.test.ts`)
- Error type transformations
- Network error handling
- HTTP status code error handling

### Auth Service Tests (`auth.test.ts`)
- Login and registration
- User profile management
- Social authentication (Google, Apple, Facebook)
- Password reset flow
- Token authentication

### Chat Service Tests (`chat.test.ts`)
- Sending messages (with 120s timeout)
- Fetching conversations with pagination
- Fetching conversation messages
- Reporting messages
- Downloading conversations

## Test Structure

All tests use Vitest with the following setup:
- **Environment**: jsdom (for browser-like environment)
- **Mocking**: vi.mock() for dependencies
- **Assertions**: Vitest's expect API

## Notes

- Tests mock external dependencies (axios, js-cookie) to avoid actual API calls
- All tests are isolated and don't depend on external services
- The test suite verifies the service layer logic and error handling

