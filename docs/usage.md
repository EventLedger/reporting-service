# Usage & Local Development

This section describes how to run and test the service locally, including common commands and environment considerations.

## Prerequisites

- Node.js (compatible version as per package.json)
- npm
- Optional: Docker for integration tests (depending on environment)

## Common Commands

- Install dependencies: npm install
- Build: npm run build
- Run tests: npm test
- Run offline/serverless offline: npm run offline
- Start in development mode (if applicable): npm run start or npm run dev (if defined)

## Environment & Configuration

- Review .env.example for required environment variables.
- When running tests, mongodb-memory-server may be used to mock MongoDB.

## Troubleshooting

- If tests fail due to missing environment variables, copy .env.example to .env and fill the values.
- Ensure serverless offline is properly configured for local testing.
