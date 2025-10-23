import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { notion, submissionDBNotionID, mediaDBNotionID } from "@lib/globals";

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
    getCurrentMedia: defineAction({
        handler: async () => {
            const today = new Date().toISOString().split("T")[0];
            //weird hack to avoid ts error where databases does not have query
            const databases: any = notion.databases;
            const response = await databases.query({
                database_id: mediaDBNotionID,
                filter: {
                    and: [
                        {
                            property: "viewableDate",
                            date: {
                                on_or_after: today,
                            },
                        },
                        {
                            property: "viewableDate",
                            date: {
                                on_or_before: today,
                            },
                        },
                    ],
                },
            });

            return response.results;
        },
    }),
};
