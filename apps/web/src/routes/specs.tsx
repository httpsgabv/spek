import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Specs } from "@/features/specs/specs";

const buscaSchema = z.object({ spec: z.string().optional() });

export const Route = createFileRoute("/specs")({
	validateSearch: (search) => buscaSchema.parse(search),
	component: PaginaSpecs,
});

function PaginaSpecs() {
	const { spec } = Route.useSearch();
	return <Specs spec={spec} />;
}
