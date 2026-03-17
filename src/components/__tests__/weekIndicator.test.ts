import { describe, it, expect } from "vitest";
import { formatWeekRange } from "@lib/dateHelpers";

describe("formatWeekRange", () => {
	it("formats a mid-week date as Sunday–Saturday range", () => {
		const result = formatWeekRange(new Date("2026-03-18T12:00:00Z"));
		expect(result).toBe("March 15 – 21, 2026");
	});

	it("formats a Sunday date correctly", () => {
		const result = formatWeekRange(new Date("2026-03-15T12:00:00Z"));
		expect(result).toBe("March 15 – 21, 2026");
	});

	it("handles month-crossing weeks", () => {
		const result = formatWeekRange(new Date("2026-04-01T12:00:00Z"));
		expect(result).toBe("March 29 – April 4, 2026");
	});

	it("handles year-crossing weeks", () => {
		const result = formatWeekRange(new Date("2026-01-01T12:00:00Z"));
		expect(result).toBe("December 28, 2025 – January 3, 2026");
	});
});
