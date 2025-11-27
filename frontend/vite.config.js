import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // 프론트엔드에서 /api 로 요청하면
            // 자동으로 http://localhost:8484/api 로 전달됨
            '/api': {
                target: 'http://localhost:8484',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})