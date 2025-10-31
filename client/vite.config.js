import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // CONFIGURACIÓN CLAVE PARA REACT ROUTER
  server: {
    // Esto asegura que la SPA funcione correctamente en todas las rutas
    historyApiFallback: true, 
    // Puedes especificar un puerto para desarrollo
    port: 5173,
    // Asegura que el host sea 0.0.0.0 para compatibilidad en despliegues (opcional)
    host: '0.0.0.0', 
  },
  
  // Si tu frontend estuviera en un subdirectorio (ej: /app/), usarías base: '/app/'
  // Como estás en la raíz, lo dejamos vacío, pero es bueno saberlo.
  base: '/', 
})