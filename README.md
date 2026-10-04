# Domicile Project

## Overview

Domicile is a chic, user-centric, mobile-first catalogue and enquiry website for a furniture store in Oran, Algeria. The primary conversion channel is WhatsApp.

## Setup

1. Clone the repository
2. Run \`npm install\` (or \`pnpm install\` if available)
3. Copy \`.env.example\` to \`.env\` and fill in the values.
4. Run \`npm run dev\`

## Scripts

- \`npm run dev\`: Starts the development server
- \`npm run build\`: Builds the app for production
- \`npm run start\`: Starts the production server
- \`npm run lint\`: Lints the code
- \`npm run typecheck\`: Runs TypeScript type checking
- \`npm run test\`: Runs Vitest unit tests
- \`npm run test:e2e\`: Runs Playwright end-to-end tests
- \`npm run format\`: Formats code with Prettier

## Folder Structure

- \`/app\`: Next.js 15 App Router pages and layouts
- \`/components\`: React components (UI, layout, shared)
- \`/lib\`: Utility functions and helpers
- \`/messages\`: next-intl translation files (fr, en, ar)
- \`/tests\`: Unit and E2E tests

## Conventions

- **Commits**: Conventional Commits using Husky and Commitlint.
- **Styling**: Tailwind CSS v4 with logical properties (start/end instead of left/right) to support LTR/RTL out of the box.
- **i18n**: Managed via \`next-intl\`.
