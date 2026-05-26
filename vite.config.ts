import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/bible-proxy': {
        target: 'https://api.scripture.api.bible',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bible-proxy/, '/v1'),
      },
      '/bible-api': {
        target: 'https://bible-api.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bible-api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
