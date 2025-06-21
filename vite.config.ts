import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { fileURLToPath } from 'url';

import path from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  viteStaticCopy({
    targets: [
      {
        src: path.join(
          __dirname,
          'node_modules',
          'mediainfo.js',
          'dist',
          'MediaInfoModule.wasm'
        ),
        dest: '', // copies to root of /dist → served at /MediaInfoModule.wasm
      },
    ],
  }),],
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  base: "",
});
