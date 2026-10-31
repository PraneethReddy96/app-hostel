import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    fs: {
      allow: [path.resolve(__dirname, '..')]
    }
  }
});

