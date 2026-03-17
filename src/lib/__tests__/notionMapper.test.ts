import { describe, it, expect } from "vitest";
import { mapNotionPageToPage, extractCoverUrl } from "../notionMapper";

function mockNotionPage(overrides: Record<string, any> = {}) {
	return {
		id: "page-123",
		properties: {
			title: {
				type: "title",
				title: [{ plain_text: "Test Media" }],
			},
			viewableDate: {
				type: "date",
				date: { start: "2026-03-15" },
			},
			mediaType: {
				type: "select",
				select: { name: "Video" },
			},
			creator: {
				type: "rich_text",
				rich_text: [{ plain_text: "Jane Doe" }],
			},
			source: {
				type: "url",
				url: "https://youtube.com/watch?v=abc",
			},
			submitter: {
				type: "rich_text",
				rich_text: [{ plain_text: "John" }],
			},
			...overrides,
		},
	};
}

describe("mapNotionPageToPage", () => {
	it("maps a full Notion page to Page type", () => {
		const page = mapNotionPageToPage(mockNotionPage());
		expect(page).toEqual({
			id: "page-123",
			title: "Test Media",
			viewableDate: "2026-03-15",
			mediaType: "Video",
			creator: "Jane Doe",
			submitter: "John",
			content: "",
			link: "https://youtube.com/watch?v=abc",
			coverImage: "",
		});
	});

	it("maps source URL to link field", () => {
		const page = mapNotionPageToPage(mockNotionPage());
		expect(page.link).toBe("https://youtube.com/watch?v=abc");
	});

	it("handles missing/null title gracefully", () => {
		const page = mapNotionPageToPage(
			mockNotionPage({
				title: { type: "title", title: [] },
			}),
		);
		expect(page.title).toBe("");
	});

	it("handles null date", () => {
		const page = mapNotionPageToPage(
			mockNotionPage({
				viewableDate: { type: "date", date: null },
			}),
		);
		expect(page.viewableDate).toBe("");
	});

	it("handles null select", () => {
		const page = mapNotionPageToPage(
			mockNotionPage({
				mediaType: { type: "select", select: null },
			}),
		);
		expect(page.mediaType).toBe("Other");
	});

	it("handles empty rich_text array", () => {
		const page = mapNotionPageToPage(
			mockNotionPage({
				creator: { type: "rich_text", rich_text: [] },
			}),
		);
		expect(page.creator).toBe("");
	});

	it("handles null url", () => {
		const page = mapNotionPageToPage(
			mockNotionPage({
				source: { type: "url", url: null },
			}),
		);
		expect(page.link).toBe("");
	});

	it("handles missing properties gracefully", () => {
		const page = mapNotionPageToPage({
			id: "page-456",
			properties: {},
		});
		expect(page.id).toBe("page-456");
		expect(page.title).toBe("");
		expect(page.mediaType).toBe("Other");
		expect(page.coverImage).toBe("");
	});
});

describe("extractCoverUrl", () => {
	it("extracts file cover URL", () => {
		const url = extractCoverUrl({
			cover: {
				type: "file",
				file: { url: "https://prod-files.notion.so/image.jpg", expiry_time: "2026-03-15T12:00:00Z" },
			},
		});
		expect(url).toBe("https://prod-files.notion.so/image.jpg");
	});

	it("extracts external cover URL", () => {
		const url = extractCoverUrl({
			cover: {
				type: "external",
				external: { url: "https://example.com/image.jpg" },
			},
		});
		expect(url).toBe("https://example.com/image.jpg");
	});

	it("returns empty string when no cover", () => {
		expect(extractCoverUrl({ cover: null })).toBe("");
		expect(extractCoverUrl({})).toBe("");
	});
});
