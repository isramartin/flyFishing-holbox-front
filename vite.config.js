import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  
  plugins: [react()],
   define: {
    'process.env': process.env
  },
  server: {
    open: true,  // Esto hará que se abra el navegador automáticamente
  },
})
