import react from '@vitejs/plugin-react';
import * as vite from 'vite';

// https://vitejs.dev/config/
export default vite.defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    origin: 'http://localhost:3000',
  },
});
