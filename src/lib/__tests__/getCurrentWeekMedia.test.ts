import { describe, it, expect, vi, beforeEach } from "vitest";

const mockQuery = vi.fn();

vi.mock("@notionhq/client", () => {
	return {
		Client: class {
			dataSources = { query: mockQuery };
		},
	};
});

const { getCurrentWeekMedia, mediaDataSourceID } = await import("../notion");

describe("getCurrentWeekMedia", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("queries Notion with correct date filter", async () => {
		mockQuery.mockResolvedValue({ results: [] });

		await getCurrentWeekMedia(new Date("2026-03-18T12:00:00Z"));

		expect(mockQuery).toHaveBeenCalledWith(
			expect.objectContaining({
				data_source_id: mediaDataSourceID,
				filter: expect.objectContaining({
					and: expect.arrayContaining([
						expect.objectContaining({
							property: "viewableDate",
							date: { on_or_after: "2026-03-15" },
						}),
						expect.objectContaining({
							property: "viewableDate",
							date: { on_or_before: "2026-03-21" },
						}),
					]),
				}),
			}),
		);
	});

	it("returns mapped Page objects", async () => {
		mockQuery.mockResolvedValue({
			results: [
				{
					id: "p1",
					properties: {
						title: { type: "title", title: [{ plain_text: "Cool Video" }] },
						viewableDate: {
							type: "date",
							date: { start: "2026-03-16" },
						},
						mediaType: { type: "select", select: { name: "Video" } },
						creator: {
							type: "rich_text",
							rich_text: [{ plain_text: "Creator" }],
						},
						source: { type: "url", url: "https://example.com" },
						submitter: {
							type: "rich_text",
							rich_text: [{ plain_text: "Sub" }],
						},
						content: {
							type: "rich_text",
							rich_text: [{ plain_text: "Desc" }],
						},
						link: { type: "url", url: "https://youtube.com/watch?v=abc" },
					},
				},
			],
		});

		const pages = await getCurrentWeekMedia(new Date("2026-03-18T12:00:00Z"));

		expect(pages).toHaveLength(1);
		expect(pages[0].title).toBe("Cool Video");
		expect(pages[0].id).toBe("p1");
		expect(pages[0].mediaType).toBe("Video");
	});

	it("returns empty array when no results", async () => {
		mockQuery.mockResolvedValue({ results: [] });

		const pages = await getCurrentWeekMedia(new Date("2026-03-18T12:00:00Z"));
		expect(pages).toEqual([]);
	});
});
