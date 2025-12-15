# Testing Guide

This document outlines the testing strategy, structure, and how to run tests for the repository.

## Test Structure

- tests/handlers: Tests for event handlers (e.g., getMonthlyStatements)
- tests/models: Tests for data models (e.g., Statement model)
- tests/services: Tests for service logic (e.g., reportingService)

## Testing Framework

- Jest is used for unit and integration tests. Configuration is found in jest.config.js.
- TypeScript support is enabled via ts-jest.

## Running Tests

- npm test # runs all tests
- npm run test:only <path> # run tests for a specific file if supported by configuration

## Environment for Tests

- Tests may use mongodb-memory-server to isolate MongoDB instances in memory.
- Ensure dependencies are installed before running tests.

## Adding Tests

- Follow existing patterns in tests/ to ensure compatibility with Jest setup.
- Mock external services where needed, and keep tests deterministic.
