import { Client } from "@notionhq/client";

export const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
});

export const submissionDBNotionID = import.meta.env.NOTION_SUBMISSION_DB_ID;
export const mediaDBNotionID = import.meta.env.NOTION_MEDIA_DB_ID;

export async function getDataSource(dataSourceId: string) {
    const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
    });
    return response.results;
}
