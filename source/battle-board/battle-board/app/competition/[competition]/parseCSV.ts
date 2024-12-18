import { parse } from "papaparse";

export function parseCsv<T>(fileContent: string): T[] {
	const { data, errors } = parse<T>(fileContent, {
		header: true,         // Treat the first row as the header
		skipEmptyLines: true, // Ignore empty rows
	});

	if (errors.length > 0) {
		console.error("CSV Parsing Errors:", errors);
		throw new Error("Failed to parse CSV file");
	}

	return data;
}
