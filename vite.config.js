import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true,
    }),
  ],
  define: {
    "process.env": {},
  },
  base: "./",
  server: {
    host: true, // Разрешает доступ к серверу извне (из облака)
    port: 5173, // Стандартный порт Vite
    
    // Новые параметры для исправления ERR_HTTP2_PROTOCOL_ERROR в Codespaces:
    maxSessionMemory: 100, // Ограничивает память сессии, предотвращая обрыв HTTP/2 прокси-сервером GitHub
    allowedHosts: [".github.dev"], // Разрешает хосты домена Codespaces
    
    watch: {
      usePolling: true, // Обеспечивает стабильное отслеживание изменений файлов в Docker-контейнере
    },
  }
});
