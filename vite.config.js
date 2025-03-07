import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

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
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  }
});
