import { Client } from "@notionhq/client";
import Airtable from "airtable";

export const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
});

export const airTableBase = new Airtable({
    apiKey: import.meta.env.AIRTABLE_API_KEY,
}).base(import.meta.env.AIRTABLE_SUBMISSIONS_ID);

export const submissionDBNotionID = import.meta.env.NOTION_SUBMISSION_DB_ID;
