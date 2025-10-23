import { defineCollection } from "astro:content";
import { actions } from "astro:actions";
import type { Page } from "@types";

const notionCollection = defineCollection({
    loader: async () => {
        const pages: Page[] = await actions.getCurrentMedia();
        console.log(pages);
        return pages.map((page) => ({
            id: page.id,
            // map your data
        }));
    },
});

export const collections = { notion: notionCollection };
