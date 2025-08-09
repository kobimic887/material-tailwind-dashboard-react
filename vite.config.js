import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  define: {
    'process.env': {},
    global: 'window',
  },
  server: {
    host:'0.0.0.0',
    https: false,
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001', // Use IPv4 instead of localhost
        changeOrigin: true,
        secure: false,
      },
    },
  },
});