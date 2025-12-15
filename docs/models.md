# Data Models: Statement

This document describes the Statement data model used for monthly statements.

## Core Interfaces

- IStatement: Represents a statement document for an account, month, and year.
- ICurrencyStatement: Represents per-currency data for a statement, including transactions and balances.

## IStatement

- accountId: string — Identifier for the account this statement belongs to.
- month: number — Calendar month (1-12).
- year: number — Calendar year.
- currencies: ICurrencyStatement[] — Array of per-currency data.

## ICurrencyStatement

- currency: string — Currency code (e.g., USD, EUR).
- transactions: { type: 'INBOUND' | 'OUTBOUND'; amount: number; date: Date }[]
  - Each transaction has a type, amount, and date.
- openingBalance?: number — Opening balance for the currency in the statement (defaults to 0).
- closingBalance: number — Closing balance for the currency.

## Mongoose Schema Details

- CurrencyStatementSchema:
  - currency: String (required)
  - transactions: Array of { type, amount, date } with type restricted to INBOUND/OUTBOUND
  - openingBalance: Number (default 0)
  - closingBalance: Number (required)
- StatementSchema:
  - accountId: String (required)
  - month: Number (required)
  - year: Number (required)
  - currencies: Array of CurrencyStatementSchema (required)

## Notes

- The data model uses Mongoose with TypeScript interfaces (IStatement, ICurrencyStatement) to ensure type-safety across services.
- The TransactionType enum is defined in src/events/transactionEvent.ts and is reused in the schema to validate transaction types.
- This model is designed to easily extend to multi-currency statements while keeping per-currency balances and transactions encapsulated.
