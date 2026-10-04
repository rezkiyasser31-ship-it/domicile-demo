# Domicile Test Suite

This directory contains the Playwright E2E regression test suite for the Domicile static showroom.

## Coverage
The suite (`tests/smoke.spec.js`) is organized into logical `describe` blocks and covers the following key areas across both desktop (~1280px) and mobile (~375px) viewports:
- **Navigation & Core Pages**: index load, contact form interactions (with demo alert check).
- **I18n & Localization**: dynamic language toggle between FR/EN across the site.
- **Catalog & Filtering**: filter combinations (category, material, stock, sorting), URL query param syncing, and the empty-state when no products match.
- **Product Details & Wishlist**: accurate product detail rendering, WhatsApp link pre-fill, and wishlist toggle state persistence (using `localStorage`).
- **Admin Dashboard**: login-less access check, KPI/chart rendering, time-range toggle, and CSV export.
- **SEO Metadata**: meta tags correctly populated, including `noindex` for the admin area.
- **Mobile Viewport Specific**: hamburger navigation menu opening/closing appropriately.

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install --with-deps chromium
   ```
3. Run the tests:
   ```bash
   npx playwright test
   ```

A local dev server will automatically start at `http://localhost:8080`.

## CI Integration
These tests are automatically executed by GitHub Actions on every `push` or `pull_request` to the `main` branch. The build will fail if any test fails, acting as a regression safety net for future development.
