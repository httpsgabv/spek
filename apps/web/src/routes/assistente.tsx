import { createFileRoute } from "@tanstack/react-router";
import { Assistente } from "@/features/assistente/assistente";

export const Route = createFileRoute("/assistente")({
	component: Assistente,
});
