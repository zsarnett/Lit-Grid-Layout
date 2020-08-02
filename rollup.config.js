import typescript from "@rollup/plugin-typescript";
import filesize from "rollup-plugin-filesize";
import minifyHTML from "rollup-plugin-minify-html-literals";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/lit-grid-layout.ts",
  output: {
    file: "dist/lit-grid-layout.js",
    format: "esm",
    inlineDynamicImports: true,
    sourcemap: "inline",
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    typescript(),
    minifyHTML(),
    terser({
      warnings: true,
      ecma: 2017,
      compress: {
        unsafe: true,
      },
      output: {
        comments: false,
      },
    }),
    filesize({
      showBrotliSize: true,
    }),
  ],
};
