import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/lit-grid-layout.ts",
  output: {
    file: "dist/lit-grid-layout.js",
    format: "es",
  },
  plugins: [
    typescript(),
    nodeResolve({
      extensions: [".js", ".ts"],
      preferBuiltins: false,
      browser: true,
    }),
    terser(),
  ],
};
