import { defineConfig } from "vite";
import htmlMinify from "vite-plugin-html-minify";
import generateEntries from "./generateEntries.js";
import VitePluginClean from "vite-plugin-clean";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: "src",
    publicDir: "public",
    server: {
        proxy: {
            "/send-contact": "http://localhost:4000",
        },
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            // auto-discover every .html file under src/
            input: generateEntries("src"),
            output: {
                entryFileNames: "js/[name]-[hash].min.js",
                chunkFileNames: "js/[name]-[hash].min.js",
                // @ts-ignore  Rollup marks "name" deprecated; we still use it
                assetFileNames: ({ name }) =>
                    name.endsWith(".css")
                        ? "css/[name]-[hash].min.css"
                        : "assets/[name]-[hash][extname]",
            },
        },
    },
    plugins: [
        // Clean dist directory before build
        VitePluginClean({
            targets: [resolve(root, "dist")],
            verbose: true,
            dry: false,
        }),
        htmlMinify({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        }),
    ],
});
