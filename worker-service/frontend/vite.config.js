import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    plugins: [basicSsl()],
    build: {
        outDir: '../src/main/resources/static/forms',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8085',
                changeOrigin: true,
            },
        },
    },
});