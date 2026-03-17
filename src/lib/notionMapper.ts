import type { Page, MediaType } from "@types/index";

const VALID_MEDIA_TYPES: MediaType[] = [
	"Text",
	"Video",
	"Audio",
	"Image",
	"Interactive",
	"Other",
];

function extractTitle(properties: Record<string, any>): string {
	const prop = properties.title;
	if (!prop?.title?.length) return "";
	return prop.title.map((t: any) => t.plain_text).join("");
}

function extractDate(
	properties: Record<string, any>,
	key: string,
): string {
	const prop = properties[key];
	if (!prop?.date?.start) return "";
	return prop.date.start;
}

function extractSelect(
	properties: Record<string, any>,
	key: string,
): string | null {
	const prop = properties[key];
	return prop?.select?.name ?? null;
}

function extractUrl(
	properties: Record<string, any>,
	key: string,
): string {
	const prop = properties[key];
	return prop?.url ?? "";
}

function extractText(
	properties: Record<string, any>,
	key: string,
): string {
	const prop = properties[key];
	// Handle both rich_text and plain text property types
	if (prop?.rich_text?.length) {
		return prop.rich_text.map((t: any) => t.plain_text).join("");
	}
	if (typeof prop?.plain_text === "string") return prop.plain_text;
	if (typeof prop === "string") return prop;
	return "";
}

export function extractCoverUrl(notionPage: any): string {
	const cover = notionPage.cover;
	if (!cover) return "";
	if (cover.type === "file") return cover.file?.url ?? "";
	if (cover.type === "external") return cover.external?.url ?? "";
	return "";
}

export function mapNotionPageToPage(notionPage: any): Page {
	const props = notionPage.properties ?? {};
	const rawMediaType = extractSelect(props, "mediaType");
	const mediaType: MediaType = VALID_MEDIA_TYPES.includes(
		rawMediaType as MediaType,
	)
		? (rawMediaType as MediaType)
		: "Other";

	return {
		id: notionPage.id ?? "",
		title: extractTitle(props),
		viewableDate: extractDate(props, "viewableDate"),
		mediaType,
		creator: extractText(props, "creator"),
		submitter: extractText(props, "submitter"),
		content: extractText(props, "content"),
		link: extractUrl(props, "source"),
		coverImage: "",
	};
}
