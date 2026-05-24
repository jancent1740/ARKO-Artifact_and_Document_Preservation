import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for React optimization
      babel: {
        plugins: [
          // Add any additional Babel plugins here if needed
        ],
      },
    }),
  ],
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './pages'),
      '@imports': path.resolve(__dirname, './imports'),
      '@styles': path.resolve(__dirname, './styles'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for debugging production builds
    minify: 'esbuild',
    target: 'es2015',
    
    // Chunk splitting strategy for optimal loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Split UI components
          'ui-components': [
            './components/ui/skeleton',
            './components/ui/button',
            './components/ui/card',
          ],
          
          // Split page components (if they weren't already lazy loaded)
          // Note: Since we use lazy() in App.tsx, these are already code-split
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/woff|woff2|eot|ttf|otf/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    },
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'clsx',
    ],
    exclude: [
      // Exclude any packages that should not be pre-bundled
    ],
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    open: true,
  },
})
