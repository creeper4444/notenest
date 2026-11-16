import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative paths make the same build work on GitHub Pages project subpaths.
export default defineConfig({
  plugins: [react()],
  base: './',
});
