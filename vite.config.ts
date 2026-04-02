import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

// Resolves `figma:asset/...` imports (used in Figma Make) so the app compiles.
// Replace the logo src with a real image when you have one.
function figmaAssetsPlugin(): Plugin {
  return {
    name: "figma-assets",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) return "\0" + id;
    },
    load(id) {
      if (id.startsWith("\0figma:asset/")) return "export default ''";
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetsPlugin(), react()],
});
