import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Para o GitHub Pages o base é passado no script "build:pages" (package.json).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
