import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadImage } from "../imageDownloader";

vi.mock("node:fs", () => ({
	existsSync: vi.fn(() => true),
	mkdirSync: vi.fn(),
	writeFileSync: vi.fn(),
}));

import { writeFileSync } from "node:fs";

describe("downloadImage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("downloads an image and returns local path", async () => {
		const fakeImageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG magic bytes
		const mockResponse = {
			ok: true,
			headers: new Headers({ "content-type": "image/png" }),
			arrayBuffer: () => Promise.resolve(fakeImageData.buffer),
		};
		vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
			mockResponse as unknown as Response,
		);

		const result = await downloadImage(
			"https://example.com/image.png",
			"test-page-id",
		);

		expect(result).toBe("/media/test-page-id.png");
		expect(writeFileSync).toHaveBeenCalledWith(
			expect.stringContaining("test-page-id.png"),
			expect.any(Buffer),
		);
	});

	it("returns empty string on fetch failure", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
			ok: false,
			status: 404,
			headers: new Headers(),
		} as unknown as Response);

		const result = await downloadImage(
			"https://example.com/missing.jpg",
			"test-page-id",
		);

		expect(result).toBe("");
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it("returns empty string on network error", async () => {
		vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
			new Error("Network error"),
		);

		const result = await downloadImage(
			"https://example.com/fail.jpg",
			"test-page-id",
		);

		expect(result).toBe("");
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it("extracts extension from content-type header", async () => {
		const fakeData = new Uint8Array([0xff, 0xd8, 0xff]);
		vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
			ok: true,
			headers: new Headers({ "content-type": "image/jpeg" }),
			arrayBuffer: () => Promise.resolve(fakeData.buffer),
		} as unknown as Response);

		const result = await downloadImage(
			"https://prod-files.notion.so/secure/some-signed-url",
			"test-page-id",
		);

		expect(result).toBe("/media/test-page-id.jpg");
		expect(writeFileSync).toHaveBeenCalledWith(
			expect.stringContaining("test-page-id.jpg"),
			expect.any(Buffer),
		);
	});
});
