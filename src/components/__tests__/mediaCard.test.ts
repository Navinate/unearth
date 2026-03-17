import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MediaCard from "../MediaCard.astro";
import type { Page } from "@types/index";

function makePage(overrides: Partial<Page> = {}): Page {
	return {
		id: "test-id",
		title: "Test Title",
		viewableDate: "2026-03-15",
		mediaType: "Text",
		creator: "Test Creator",
		submitter: "Tester",
		content: "A great description",
		link: "https://example.com",
		coverImage: "",
		...overrides,
	};
}

describe("MediaCard", () => {
	it("renders as a clickable button", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage() },
		});

		expect(result).toContain("<button");
		expect(result).toContain('data-modal-target="modal-test-id"');
		expect(result).toContain('type="button"');
	});

	it("renders title and creator", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage() },
		});

		expect(result).toContain("Test Title");
		expect(result).toContain("Test Creator");
	});

	it("renders cover image when present", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage({ coverImage: "/media/test.jpg" }) },
		});

		expect(result).toContain('src="/media/test.jpg"');
		expect(result).toContain("cover-image");
	});

	it("does not render cover image when absent", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage({ coverImage: "" }) },
		});

		expect(result).not.toContain("cover-image");
	});

	it("truncates description with CSS clamp class", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage({ content: "A long description" }) },
		});

		expect(result).toContain("description");
		expect(result).toContain("A long description");
	});

	it("renders submitter", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage({ submitter: "Alice" }) },
		});

		expect(result).toContain("submitted by Alice");
	});

	it("renders a corresponding dialog modal", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaCard, {
			props: { page: makePage() },
		});

		expect(result).toContain('<dialog id="modal-test-id"');
		expect(result).toContain("media-modal");
	});
});
