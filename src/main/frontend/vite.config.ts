import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build the SPA into Spring's static resources so the one jar serves it (BASE_CHECKLIST.md §B).
// emptyOutDir:false because outDir is outside the vite project root (avoids deleting sibling files).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../resources/static',
    emptyOutDir: false,
  },
});
