import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/imbs-chat-room/',
  plugins: [react()],
});
