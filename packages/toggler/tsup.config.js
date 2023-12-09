import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  shims: true,
  sourcemap: true,
  clean: true,
  metafile: true,
});
