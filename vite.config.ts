import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/go-api': {
                target: 'http://go-api:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/go-api/, ''),
            },
            '/php-api': {
                target: 'http://php-api:80',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/php-api/, ''),
            },
        },
    },
});
