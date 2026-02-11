// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures your env variables are available
    'process.env': {}
  }
})