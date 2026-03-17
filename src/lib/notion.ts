import { Client } from "@notionhq/client";
import { mapNotionPageToPage, extractCoverUrl } from "./notionMapper";
import { downloadImage } from "./imageDownloader";
import { getWeekBounds, toISODateString } from "./dateHelpers";
import type { Page } from "@types/index";

export const notion = new Client({
	auth: import.meta.env.NOTION_TOKEN,
});

export const submissionDBNotionID = import.meta.env.NOTION_SUBMISSION_DB_ID;
export const mediaDBNotionID = import.meta.env.NOTION_MEDIA_DB_ID;
export const mediaDataSourceID = import.meta.env.NOTION_MEDIA_DATASOURCE_ID;

export function getCurrentWeekBounds(now: Date = new Date()): {
	start: string;
	end: string;
} {
	const { sunday, saturday } = getWeekBounds(now);
	return { start: toISODateString(sunday), end: toISODateString(saturday) };
}

export async function getCurrentWeekMedia(
	now: Date = new Date(),
): Promise<Page[]> {
	const { start, end } = getCurrentWeekBounds(now);

	const response = await notion.dataSources.query({
		data_source_id: mediaDataSourceID,
		filter: {
			and: [
				{
					property: "viewableDate",
					date: { on_or_after: start },
				},
				{
					property: "viewableDate",
					date: { on_or_before: end },
				},
			],
		},
		sorts: [
			{
				property: "viewableDate",
				direction: "ascending",
			},
		],
	});

	const pages = response.results.map((page: any) => mapNotionPageToPage(page));

	// Download cover images in parallel
	await Promise.all(
		response.results.map(async (notionPage: any, i: number) => {
			const coverUrl = extractCoverUrl(notionPage);
			if (coverUrl) {
				pages[i].coverImage = await downloadImage(coverUrl, pages[i].id);
			}
		}),
	);

	return pages;
}
