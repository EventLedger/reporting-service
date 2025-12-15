# Repository Documentation

This document provides an overview of the repository, its structure, how to run and test the project, deployment notes, and contribution guidelines.

## Quickstart

1) Install dependencies
- npm install

2) Run tests
- npm test

3) Build the project
- npm run build

4) Run the service locally (if applicable)
- npm run offline

> Note: This project uses TypeScript and Serverless. Ensure you have a compatible Node.js environment before running the scripts.

## Project Overview

- The repository implements a serverless/event-driven reporting service focused on generating monthly statements.
- Core domains include: events ingestion, monthly statement generation, and reporting services.
- The codebase emphasizes clear separation of concerns across:
  - src/events: Event definitions and mocks
  - src/handlers: Handlers wiring events to processing logic
  - src/models: Data models used across services
  - src/services: Business logic implementations
  - src/utils: Shared utilities and helpers

## Directory Structure

- src/
  - events/            Event definitions and mocks (e.g., transactionEvent.ts, transactionEvent.mock.json)
  - handlers/          Handlers that react to events and coordinate services (e.g., getMonthlyStatements.ts, transactionEventListener.ts)
  - models/            Core domain models (e.g., statement.ts)
  - services/          Business logic and orchestration (e.g., reportingService.ts)
  - utils/             Helpers, utilities, and error handling (e.g., connectToDB.ts, dateUtils.ts, exceptions.ts, withErrorHandling.ts)
- tests/
  - handlers/          Tests for event handlers
  - models/            Tests for data models
  - services/          Tests for service layer
- .env.example         Environment variable template
- serverless.yml        Serverless configuration
- README.md             This repository overview
- package.json          Project metadata and scripts

## How to Read the Codebase

- Review src/events and src/handlers to understand the event flow through the system.
- Inspect src/models for core data structures used across services.
- Check src/services for business logic and orchestration.
- Review tests in tests/ to understand expected behavior and edge cases.
- Look at serverless.yml to understand deployment configuration and stage mappings.

## Data Models

### statement.ts
- Defines the Statement data model used for monthly reports. (See src/models/statement.ts for details)

## Testing

- Tests live under tests/ and include:
  - tests/handlers/getMonthlyStatements.test.ts
  - tests/models/statement.test.ts
  - tests/services/reportingService.test.ts
- Jest is configured in jest.config.js and tests are run via npm test.

## Deployment & Running

- This project uses Serverless Framework. The serverless.yml file configures resources and functions.
- Common commands:
  - npm run build: TypeScript compilation
  - npm run offline: Run serverless offline for local development
  - npm run deploy: Deploy to dev environment
  - npm run deploy:prod: Deploy to production environment

## Environment

- Dependencies include: express, mongoose, serverless-http, aws-lambda
- Development tooling includes: typescript, jest, eslint, prettier
- MongoDB is used via mongoose; tests may use mongodb-memory-server for isolation.

## Contribution Guidelines

- Follow the repository's coding standards and run tests before pushing.
- Add tests for new features or bug fixes.
- Document any breaking changes and update docs accordingly.

## Next Steps

- See docs/architecture.md for a deeper architectural overview.
- See docs/models.md and docs/services.md for detailed documentation of core components.
- Consider adding an API reference if REST endpoints are introduced in the future.
