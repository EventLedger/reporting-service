# Deployment Guide

This document covers how to deploy the service and run in development mode.

## Serverless Configuration

- The repository uses Serverless Framework via serverless.yml to configure functions, resources, and stages.
- Typical commands:
  - Deploy to dev: npm run deploy
  - Deploy to production: npm run deploy:prod

## Offline / Local Development

- Use serverless-offline for local development with offline emulation of AWS Lambda and API gateway.
- Steps:
  1. Build: npm run build
  2. Start offline: npm run offline
- Offlining provides a local environment for testing without deploying to AWS.

## Environment Variables

- Review .env.example for required environment variables.
- For local testing, ensure any required MongoDB connection strings are available or mocked via mongodb-memory-server in tests.

## Continuous Delivery / CI

- The repository does not include a full CI/CD script by default; integrate with your CI to run npm install, npm test, and npm run build on pull requests.
