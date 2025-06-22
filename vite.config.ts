import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ Set base to '/' for proper routing on Vercel
  css: {
    postcss: './postcss.config.js',
  },
})
