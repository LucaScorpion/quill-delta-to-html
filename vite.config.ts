import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  base: '/quill-delta-to-html',
  build: {
    outDir: '../pages',
  },
});
