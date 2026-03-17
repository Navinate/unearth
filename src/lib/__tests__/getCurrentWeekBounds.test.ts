import { describe, it, expect } from "vitest";
import { getCurrentWeekBounds } from "../notion";

describe("getCurrentWeekBounds", () => {
	it("returns Sunday-Saturday for a mid-week date (Wednesday)", () => {
		const wed = new Date("2026-03-18T12:00:00Z"); // Wednesday
		const { start, end } = getCurrentWeekBounds(wed);
		expect(start).toBe("2026-03-15"); // Sunday
		expect(end).toBe("2026-03-21"); // Saturday
	});

	it("returns correct bounds when given a Sunday", () => {
		const sun = new Date("2026-03-15T05:00:00Z"); // Sunday
		const { start, end } = getCurrentWeekBounds(sun);
		expect(start).toBe("2026-03-15");
		expect(end).toBe("2026-03-21");
	});

	it("returns correct bounds when given a Saturday", () => {
		const sat = new Date("2026-03-21T12:00:00Z"); // Saturday
		const { start, end } = getCurrentWeekBounds(sat);
		expect(start).toBe("2026-03-15");
		expect(end).toBe("2026-03-21");
	});

	it("handles month boundaries", () => {
		const tue = new Date("2026-04-01T12:00:00Z"); // Wednesday Apr 1
		const { start, end } = getCurrentWeekBounds(tue);
		expect(start).toBe("2026-03-29"); // Sunday Mar 29
		expect(end).toBe("2026-04-04"); // Saturday Apr 4
	});

	it("handles year boundaries", () => {
		const thu = new Date("2026-01-01T12:00:00Z"); // Thursday Jan 1
		const { start, end } = getCurrentWeekBounds(thu);
		expect(start).toBe("2025-12-28"); // Sunday Dec 28
		expect(end).toBe("2026-01-03"); // Saturday Jan 3
	});
});
