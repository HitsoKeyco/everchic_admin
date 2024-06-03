import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//base: '/admin',
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000 
  }
})
