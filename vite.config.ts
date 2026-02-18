import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/lib": path.resolve(__dirname, "./src/shared/lib"),
      "@/hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@/components/ui": path.resolve(__dirname, "./src/shared/components/ui"),
      "@/components": path.resolve(__dirname, "./src/shared/components"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
