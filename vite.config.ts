import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'urfa-web-app';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/',
  server: {
    port: 3000,
    open: true,
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
  optimizeDeps: {
    include: ['three', '@react-three/fiber'],
  },
}));
