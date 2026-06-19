// @playwright/test non è una dipendenza installata: config come plain object.
// Il CLI Playwright legge default export senza bisogno di defineConfig.
const config = {
  testMatch: "**/*.spec.ts", // solo E2E, non i test unitari
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
