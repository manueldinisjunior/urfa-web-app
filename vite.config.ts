import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'urfa-web-app';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    allowedHosts: ['terminal.local'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}));
