import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.spec.ts',   // solo E2E, non i test unitari
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
