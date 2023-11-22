/*
 * @Description: 
 * @Author: wangmeng
 * @Date: 2023-11-22 09:50:53
 * @LastEditTime: 2023-11-22 10:01:47
 */
import path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 8082, // host: "localhost",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
