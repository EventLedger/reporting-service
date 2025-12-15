# Architecture Overview

This document describes the high-level architecture of the repository, including major components, data flow, and design patterns.

## Core Components

- src/events: Event definitions and mocks used for event-driven processing.
- src/handlers: Handlers that react to events and coordinate service calls.
- src/models: Core domain models, such as Statement.
- src/services: Business logic and orchestration between modules.
- src/utils: Shared utilities, error handling, and helpers.

## Data Flow

1. Events are produced and dispatched into the system (e.g., transaction events).
2. Handlers listen to events and forward processing to the appropriate services.
3. Services perform business logic, interact with the database via models, and produce results.
4. Results are stored, logged, and (if necessary) emitted as new events.

## Design Patterns & Practices

- Separation of concerns: events, handlers, services, models, and utils are decoupled.
- Dependency-free business logic in services where possible; database access is isolated in models.
- Error handling is centralized via utils/withErrorHandling.ts and utilities.

## Dependencies & Environment

- Node.js with TypeScript
- Serverless Framework for deployment (serverless.yml)
- MongoDB via mongoose for persistence

## Data Model Interaction

- The system uses Mongoose models to interact with MongoDB, ensuring consistent schema validation and interaction patterns.
- Business logic resides in services, while persistence is encapsulated in models.

## Extension Points

- Adding new events: extend src/events and corresponding handlers and services.
- Adding APIs: if REST endpoints are introduced, they would be in a dedicated API layer (not present in this repo currently).

## Deployment Notes

- Deploy with Serverless Framework (serverless.yml). Separate stages (dev/prod) are configured.
- Local development can leverage serverless-offline for testing API and function wiring.
