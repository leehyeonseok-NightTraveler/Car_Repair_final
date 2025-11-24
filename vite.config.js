import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🚨 Proxy 설정: /api로 시작하는 요청은 스프링 부트(8484)로 보냄
    proxy: {
      '/api': {
        target: 'http://localhost:8484',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})