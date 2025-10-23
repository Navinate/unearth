// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],
    output: "server",

    vite: {
        plugins: [tailwindcss()],
    },

    adapter: vercel({
        webAnalytics: {
            enabled: true,
        },
    }),
});
