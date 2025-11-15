import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor_recharts'
            if (id.includes('framer-motion')) return 'vendor_framer'
            if (id.includes('lucide-react')) return 'vendor_icons'
            if (id.includes('react-dom') || id.includes('react')) return 'vendor_react'
            return 'vendor'
          }
        }
      }
    }
  }
})
