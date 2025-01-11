import fs from "fs";
import path from "path";
import { defineConfig, Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from "url";

const wasmMimeTypePlugin: Plugin = {
  name: "wasm-mime-type-plugin",
  apply: 'serve',
  configureServer(server) {
    console.log("wasm-file-server-plugin registered");

    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.endsWith(".wasm")) {
        console.log("Serving .wasm file from custom plugin", req.url);

        const filePath = path.join(__dirname, "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm");

        if (fs.existsSync(filePath)) {
          res.setHeader("Content-Type", "application/wasm");
          fs.createReadStream(filePath).pipe(res);
        } else {
          console.error("WASM file not found:", filePath);
          res.statusCode = 404;
          res.end();
        }
      } else {
        return next();
      }
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tsconfigPaths(), wasmMimeTypePlugin],
  resolve: {
    alias: [
      { find: '@onnx', replacement: fileURLToPath(new URL('./src/onnx', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
    ],
  },
})
