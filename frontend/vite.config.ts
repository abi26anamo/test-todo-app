import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react()],
    resolve: {
      alias: {
        ui: resolve(__dirname, "src/components/ui"),
      },
    },
    server: {
      proxy: env.VITE_API_URL
        ? undefined
        : {
            "/todos": {
              target: "http://127.0.0.1:4000",
              changeOrigin: true,
            },
          },
    },
    define: {
      __API__: JSON.stringify(env.VITE_API_URL || ""),
    },
  }
})
