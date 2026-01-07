import { defineConfig } from 'vite';

export default defineConfig({
  base: '/loomcommander/loomlib/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
