import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { notion, submissionDBNotionID } from "@lib/notion";

export const server = {
    submitToNotion: defineAction({
        accept: "form",
        input: z.object({
            title: z.string().min(1).max(200),
            mediaType: z.enum(["Text", "Video", "Audio", "Image", "Interactive", "Other"]),
            description: z.string().min(1).max(2000),
            link: z.string().url(),
            name: z.string().max(100).optional().default(""),
        }),
        handler: async (input) => {
            try {
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
            } catch (err) {
                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to submit recommendation. Please try again.",
                });
            }
        },
    }),
};
