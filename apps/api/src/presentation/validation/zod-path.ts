import type { z } from "zod";

export interface FieldError {
	field: string;
	message: string;
}

export function fieldPath(path: readonly PropertyKey[]): string {
	return path.reduce<string>((acc, part) => {
		if (typeof part === "number") return `${acc}[${part}]`;
		return acc ? `${acc}.${String(part)}` : String(part);
	}, "");
}

export function toFieldErrors(error: z.ZodError): FieldError[] {
	return error.issues.flatMap((issue) =>
		issue.code === "unrecognized_keys"
			? issue.keys.map((key) => ({
					field: fieldPath([...issue.path, key]),
					message: "Campo desconhecido.",
				}))
			: [{ field: fieldPath(issue.path), message: issue.message }],
	);
}
