import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MEDIA_DIR = "public/media";

function ensureMediaDir(): void {
	if (!existsSync(MEDIA_DIR)) {
		mkdirSync(MEDIA_DIR, { recursive: true });
	}
}

function getExtension(url: string, contentType?: string): string {
	// Try to get extension from content-type header
	if (contentType) {
		const match = contentType.match(/image\/(jpeg|png|gif|webp|svg\+xml|avif)/);
		if (match) {
			return match[1] === "jpeg" ? "jpg" : match[1] === "svg+xml" ? "svg" : match[1];
		}
	}

	// Fallback: extract from URL path (before query params)
	const pathname = new URL(url).pathname;
	const ext = pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i);
	if (ext) return ext[1].toLowerCase();

	return "jpg";
}

export async function downloadImage(
	url: string,
	pageId: string,
): Promise<string> {
	ensureMediaDir();

	try {
		const response = await fetch(url);
		if (!response.ok) {
			console.warn(`Failed to download image for ${pageId}: ${response.status}`);
			return "";
		}

		const contentType = response.headers.get("content-type") ?? undefined;
		const ext = getExtension(url, contentType);
		const filename = `${pageId}.${ext}`;
		const filepath = join(MEDIA_DIR, filename);

		const buffer = Buffer.from(await response.arrayBuffer());
		writeFileSync(filepath, buffer);

		return `/media/${filename}`;
	} catch (err) {
		console.warn(`Failed to download image for ${pageId}:`, err);
		return "";
	}
}
