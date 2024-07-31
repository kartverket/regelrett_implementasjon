import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

type Mode = 'development' | 'production' | 'test';

export default ({ mode }: { mode: Mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      origin: process.env.VITE_FRONTEND_URL,
    },
  });
};
