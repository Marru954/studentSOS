import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In sviluppo facciamo da proxy verso il backend SP: così il client e le API
// condividono l'origine (http://localhost:5173) e i cookie di sessione
// funzionano senza complicazioni CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/saml": "http://localhost:4000",
    },
  },
});
