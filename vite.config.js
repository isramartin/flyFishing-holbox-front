import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,  // Esto hará que se abra el navegador automáticamente
  },
})
