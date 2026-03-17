const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function getWeekBounds(now: Date = new Date()): {
	sunday: Date;
	saturday: Date;
} {
	const day = now.getDay();
	const sunday = new Date(now);
	sunday.setDate(now.getDate() - day);

	const saturday = new Date(sunday);
	saturday.setDate(sunday.getDate() + 6);

	return { sunday, saturday };
}

export function toISODateString(d: Date): string {
	const pad = (n: number) => n.toString().padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatWeekRange(now: Date = new Date()): string {
	const { sunday, saturday } = getWeekBounds(now);

	const sMonth = MONTHS[sunday.getMonth()];
	const sDay = sunday.getDate();
	const sYear = sunday.getFullYear();

	const eMonth = MONTHS[saturday.getMonth()];
	const eDay = saturday.getDate();
	const eYear = saturday.getFullYear();

	if (sYear !== eYear) {
		return `${sMonth} ${sDay}, ${sYear} – ${eMonth} ${eDay}, ${eYear}`;
	}

	if (sMonth !== eMonth) {
		return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${eYear}`;
	}

	return `${sMonth} ${sDay} – ${eDay}, ${eYear}`;
}
