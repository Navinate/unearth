export type MediaType =
	| "Text"
	| "Video"
	| "Audio"
	| "Image"
	| "Interactive"
	| "Other";

export type Page = {
	id: string;
	title: string;
	viewableDate: string;
	mediaType: MediaType;
	creator: string;
	submitter: string;
	content: string;
	link: string;
	coverImage: string;
};
