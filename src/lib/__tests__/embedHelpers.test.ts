import { describe, it, expect } from "vitest";
import {
	parseVideoEmbed,
	parseAudioEmbed,
	isDirectImageUrl,
	extractDomain,
} from "../embedHelpers";

describe("parseVideoEmbed", () => {
	it("parses youtube.com/watch?v= URL", () => {
		const result = parseVideoEmbed("https://youtube.com/watch?v=abc123");
		expect(result).toEqual({
			provider: "youtube",
			embedUrl: "https://www.youtube.com/embed/abc123",
		});
	});

	it("parses www.youtube.com/watch?v= URL", () => {
		const result = parseVideoEmbed(
			"https://www.youtube.com/watch?v=abc123&t=10",
		);
		expect(result).toEqual({
			provider: "youtube",
			embedUrl: "https://www.youtube.com/embed/abc123",
		});
	});

	it("parses youtu.be short URL", () => {
		const result = parseVideoEmbed("https://youtu.be/abc123");
		expect(result).toEqual({
			provider: "youtube",
			embedUrl: "https://www.youtube.com/embed/abc123",
		});
	});

	it("parses vimeo.com URL", () => {
		const result = parseVideoEmbed("https://vimeo.com/123456");
		expect(result).toEqual({
			provider: "vimeo",
			embedUrl: "https://player.vimeo.com/video/123456",
		});
	});

	it("returns null for unknown URL", () => {
		const result = parseVideoEmbed("https://example.com/video");
		expect(result).toEqual({ provider: null, embedUrl: null });
	});
});

describe("parseAudioEmbed", () => {
	it("parses Spotify track URL", () => {
		const result = parseAudioEmbed(
			"https://open.spotify.com/track/abc123def",
		);
		expect(result).toEqual({
			provider: "spotify",
			embedUrl: "https://open.spotify.com/embed/track/abc123def",
		});
	});

	it("parses Spotify album URL", () => {
		const result = parseAudioEmbed(
			"https://open.spotify.com/album/xyz789",
		);
		expect(result).toEqual({
			provider: "spotify",
			embedUrl: "https://open.spotify.com/embed/album/xyz789",
		});
	});

	it("parses SoundCloud URL", () => {
		const result = parseAudioEmbed(
			"https://soundcloud.com/artist/track-name",
		);
		expect(result).toEqual({
			provider: "soundcloud",
			embedUrl:
				"https://w.soundcloud.com/player/?url=https://soundcloud.com/artist/track-name&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true",
		});
	});

	it("returns null for unknown URL", () => {
		const result = parseAudioEmbed("https://example.com/audio");
		expect(result).toEqual({ provider: null, embedUrl: null });
	});
});

describe("isDirectImageUrl", () => {
	it("returns true for .jpg", () => {
		expect(isDirectImageUrl("https://example.com/photo.jpg")).toBe(true);
	});

	it("returns true for .png", () => {
		expect(isDirectImageUrl("https://example.com/photo.png")).toBe(true);
	});

	it("returns true for .webp", () => {
		expect(isDirectImageUrl("https://example.com/photo.webp")).toBe(true);
	});

	it("returns true for .gif", () => {
		expect(isDirectImageUrl("https://example.com/image.gif")).toBe(true);
	});

	it("returns false for non-image URL", () => {
		expect(isDirectImageUrl("https://example.com/page")).toBe(false);
	});

	it("handles query params after extension", () => {
		expect(isDirectImageUrl("https://example.com/photo.jpg?w=800")).toBe(
			true,
		);
	});
});

describe("extractDomain", () => {
	it("extracts domain without www", () => {
		expect(extractDomain("https://www.nytimes.com/article")).toBe(
			"nytimes.com",
		);
	});

	it("extracts domain without protocol", () => {
		expect(extractDomain("https://github.com/repo")).toBe("github.com");
	});

	it("handles subdomains", () => {
		expect(extractDomain("https://blog.example.com/post")).toBe(
			"blog.example.com",
		);
	});

	it("returns empty string for invalid URL", () => {
		expect(extractDomain("not-a-url")).toBe("");
	});
});
