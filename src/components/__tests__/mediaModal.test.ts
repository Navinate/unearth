import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MediaModal from "../MediaModal.astro";
import type { Page } from "@types/index";

function makePage(overrides: Partial<Page> = {}): Page {
	return {
		id: "test-id",
		title: "Test Title",
		viewableDate: "2026-03-15",
		mediaType: "Text",
		creator: "Test Creator",
		submitter: "Tester",
		content: "Full description of the media",
		link: "https://example.com/article",
		coverImage: "",
		...overrides,
	};
}

describe("MediaModal", () => {
	it("renders a dialog with the correct id", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-test-id" },
		});

		expect(result).toContain('<dialog id="modal-test-id"');
		expect(result).toContain("media-modal");
	});

	it("renders close button with aria-label", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-1" },
		});

		expect(result).toContain('aria-label="Close"');
		expect(result).toContain("data-modal-close");
	});

	it("renders cover image when present", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: {
				page: makePage({ coverImage: "/media/cover.jpg" }),
				modalId: "modal-1",
			},
		});

		expect(result).toContain("modal-cover");
		expect(result).toContain('src="/media/cover.jpg"');
	});

	it("does not render cover image when absent", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-1" },
		});

		expect(result).not.toContain("modal-cover");
	});

	it("renders full title and description", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-1" },
		});

		expect(result).toContain("Test Title");
		expect(result).toContain("Full description of the media");
	});

	it("renders source link with domain", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-1" },
		});

		expect(result).toContain("View source");
		expect(result).toContain("example.com");
		expect(result).toContain('href="https://example.com/article"');
		expect(result).toContain('target="_blank"');
	});

	it("renders submitter", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage(), modalId: "modal-1" },
		});

		expect(result).toContain("submitted by Tester");
	});

	it("renders video embed for Video type", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: {
				page: makePage({
					mediaType: "Video",
					link: "https://youtube.com/watch?v=abc123",
				}),
				modalId: "modal-1",
			},
		});

		expect(result).toContain("https://www.youtube.com/embed/abc123");
		expect(result).toContain("iframe");
	});

	it("renders audio embed for Audio type with Spotify", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: {
				page: makePage({
					mediaType: "Audio",
					link: "https://open.spotify.com/track/xyz",
				}),
				modalId: "modal-1",
			},
		});

		expect(result).toContain("https://open.spotify.com/embed/track/xyz");
		expect(result).toContain("iframe");
	});

	it("does not render embed for Text type", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(MediaModal, {
			props: { page: makePage({ mediaType: "Text" }), modalId: "modal-1" },
		});

		expect(result).not.toContain("iframe");
	});
});
