import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Hash routes (#/items/42), so any static server or backend can serve dist/
// without a route table. `npm run dev` proxies /api to a backend on API_URL.
const api = process.env.API_URL ?? "http://127.0.0.1:8000"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  build: { outDir: "dist", emptyOutDir: true, sourcemap: false, chunkSizeWarningLimit: 1200 },
  server: { port: 5173, proxy: { "/api": api } },
})
