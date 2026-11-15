import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// @ts-ignore - vitest adds 'test' property
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173, host: true },
  // GitHub Pages: base debe coincidir con el nombre del repo
  base: '/SIMTELE-RISK/',
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
