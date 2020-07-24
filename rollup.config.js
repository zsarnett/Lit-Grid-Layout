import resolve from "rollup-plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/resizable.bundled.js",
    format: "es",
    compact: true,
  },
  plugins: [
    typescript(),
    resolve({
      extensions: [".js", ".ts"],
      preferBuiltins: false,
      browser: true,
    }),
    terser(),
  ],
};
