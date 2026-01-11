import { defineConfig } from 'vite';
import { docsApiPlugin } from './vite-plugin-docs-api';

export default defineConfig({
  base: '/loomcommander/loomlib/',
  plugins: [docsApiPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
