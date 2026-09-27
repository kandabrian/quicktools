import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Helps verify our lazy-loading is working: chunk names make it obvious
    // in the build output which libraries ended up in which chunk.
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
