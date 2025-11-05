# Pre-Interview Test Assignment

This repository covers the automation part of the pre-interview test assignment, including both **E2E UI** and **API** testing using **Playwright**.

---

## Tool Selection

I chose **Playwright** as the main tool for this assignment because it is a developer-friendly framework that supports both **UI** and **API** layers within the same environment.

### Key Reasons

- **Ease of Maintenance:** Enables clean implementation using native Playwright patterns and syntax.
- **Rich Built-in API Support:** The `request` context allows thorough backend response validation without extra dependencies.
- **Ease of Setup:** TypeScript/JavaScript support allows writing UI, API, and E2E tests in a single framework with minimal complexity.
- **Cross-Browser Capabilities:** Supports dynamic testing scenarios across multiple browsers with minimal configuration.

---

## Strategy and Prioritization

Given the limited time and my primarily manual testing background, I prioritized **API-level automation** before implementing full end-to-end UI flows.

- **API tests** validate core business logic (e.g., balance checks, stake validation) faster and more reliably than UI tests.
- Strong **API coverage** provides an early safety net and helps “shift left” in the validation process.
- A **stable API layer** forms the foundation for reliable UI and end-to-end test coverage.

---

## Design Pattern and Structure

Since automation is not my primary background, I built the setup **from scratch**, focusing on creating a clean and logical structure that can be easily extended.
My goal was to demonstrate an understanding of how test architecture should evolve in a real-world project.

### Structure Overview

- **API and E2E tests** are separated for clarity and maintainability.
- **Fixtures** are used for reusable setups such as authentication and test data initialization.
- **Selectors** and **utility functions** are organized into dedicated files to reduce duplication and improve readability.

While I did not yet implement a full **POM** or centralized **config/environment** handling, the current setup is structured with those patterns in mind.
Given more time, I would:

- Refactor repetitive UI interactions into Page Objects.
- Extract environment-specific variables into a config layer for easier scaling and CI/CD integration.

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)

## Installing

1. Clone repository and navigate:

```
git clone git@github.com:Inmansuit/cb_test_assignment.git
cd cb_test_assignment
```

2. Istall depepndencies:

```
npm install
```

## Running Tests

- **Run all tests:**
  ```
  npm run test
  ```
- **Run all API tests:**
  ```
  npm run test:api
  ```
- **Run all E2E tests:**
  ```
  npm run test:e2e
  ```
- **Run signup flow:**
  ```
  npm run test:signup
  ```
- **Run login flow:**
  ```
  npm run test:login
  ```
- **Run bonus API:**
  ```
  npm run test:bonus
  ```

### Development

- **Format code:**
  ```
  npm run format
  ```
- **Verify formatting:**
  ```
  npm run format:verify
  ```
