import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 8048,
    strictPort: true,
    hmr: {
      port: 8048,
      protocol: 'ws',
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Do not use hashes in filenames
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
