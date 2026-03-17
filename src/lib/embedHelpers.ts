type EmbedResult = {
	provider: string | null;
	embedUrl: string | null;
};

export function parseVideoEmbed(url: string): EmbedResult {
	// YouTube: youtube.com/watch?v=ID or www.youtube.com/watch?v=ID
	const ytWatch = url.match(
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
	);
	if (ytWatch) {
		return {
			provider: "youtube",
			embedUrl: `https://www.youtube.com/embed/${ytWatch[1]}`,
		};
	}

	// YouTube short: youtu.be/ID
	const ytShort = url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/);
	if (ytShort) {
		return {
			provider: "youtube",
			embedUrl: `https://www.youtube.com/embed/${ytShort[1]}`,
		};
	}

	// Vimeo: vimeo.com/ID
	const vimeo = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
	if (vimeo) {
		return {
			provider: "vimeo",
			embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
		};
	}

	return { provider: null, embedUrl: null };
}

export function parseAudioEmbed(url: string): EmbedResult {
	// Spotify: open.spotify.com/track/ID or open.spotify.com/album/ID
	const spotify = url.match(
		/(?:https?:\/\/)?open\.spotify\.com\/(track|album|playlist)\/([^?]+)/,
	);
	if (spotify) {
		return {
			provider: "spotify",
			embedUrl: `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`,
		};
	}

	// SoundCloud: soundcloud.com/artist/track
	const soundcloud = url.match(
		/(?:https?:\/\/)?soundcloud\.com\/(.+)/,
	);
	if (soundcloud) {
		return {
			provider: "soundcloud",
			embedUrl: `https://w.soundcloud.com/player/?url=https://soundcloud.com/${soundcloud[1]}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`,
		};
	}

	return { provider: null, embedUrl: null };
}

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i;

export function isDirectImageUrl(url: string): boolean {
	return IMAGE_EXTENSIONS.test(url);
}

export function extractDomain(url: string): string {
	try {
		const parsed = new URL(url);
		return parsed.hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
