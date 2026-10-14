import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// En desarrollo, Vite sirve /admin.html y reenvía /api al servidor Express.
// Producción sigue compilando solo dist-admin para Render.
const apiPort = Number(process.env.OS_BACKEND_PORT || 4173);

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: '/admin.html',
    proxy: {
      '/api': { target: `http://127.0.0.1:${apiPort}`, changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist-admin',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(process.cwd(), 'admin.html')
    }
  }
});
