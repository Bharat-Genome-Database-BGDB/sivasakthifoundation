import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@components': path.resolve(__dirname, './src/components'),
      '@layout': path.resolve(__dirname, './src/components/Layout'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@unit': path.resolve(__dirname, './src/unitHelper'),
      '@db': path.resolve(__dirname, './src/services'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Simulates a browser for Check Cases
    setupFiles: './src/unitHelper/setupTests.js', // Where your global mocks live
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});