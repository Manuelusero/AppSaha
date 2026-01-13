import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno de pruebas: simula un navegador real
    environment: 'jsdom',
    
    // Archivo que se ejecuta antes de cada test
    setupFiles: ['./src/tests/setup.ts'],
    
    // Archivos de test a incluir
    include: ['**/*.{test,spec}.{ts,tsx}'],
    
    // Archivos a excluir
    exclude: ['node_modules', '.next', 'out'],
    
    // Configuración de cobertura de código
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/generated/**',
      ],
    },
    
    // Timeout para tests (útil para tests asíncronos)
    testTimeout: 10000,
    
    // Mock de variables globales útiles
    globals: true,
  },
  
  // Resolver aliases de paths (igual que Next.js)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },
});
