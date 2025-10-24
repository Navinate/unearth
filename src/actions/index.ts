import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { notion, submissionDBNotionID } from "@lib/notion";@lib/notion

export const server = {
    submitToNotion: defineAction({
        accept: "form",
        input: z.object({
            title: z.string(),
            mediaType: z.string(),
            description: z.string(),
            link: z.string(),
            name: z.string(),
        }),
        handler: async (input) => {
            await notion.pages.create({
                parent: { database_id: submissionDBNotionID },
                properties: {
                    submission: {
                        title: [
                            {
                                type: "text",
                                text: { content: input.title },
                            },
                        ],
                    },
                    submitter: {
                        rich_text: [
                            {
                                type: "text",
                                text: { content: input.name || "Anonymous" },
                            },
                        ],
                    },
                    link: { url: input.link },
                    mediaType: { select: { name: input.mediaType } },
                },
                children: [
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [
                                {
                                    type: "text",
                                    text: { content: input.description },
                                },
                            ],
                        },
                    },
                ],
            });
        },
    }),
};
