import { createFileRoute } from "@tanstack/react-router";
import { Atividade } from "@/features/atividade/atividade";

export const Route = createFileRoute("/atividade")({
	component: Atividade,
});
