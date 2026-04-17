import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = "national-flag-quiz";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? `/${repositoryName}/` : "/",
});
