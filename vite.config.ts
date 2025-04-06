import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
export default defineConfig(({ mode }) => {
  // Load environment variables from `.env` file
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::", // Allows access from any network
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Use loaded environment variable correctly
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
  };
});
