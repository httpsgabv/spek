import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3000,
		// O cliente gerado chama /api; em dev o Vite repassa para a API.
		proxy: { "/api": "http://localhost:4000" },
	},
	resolve: { tsconfigPaths: true },
	plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
