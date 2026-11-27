import { createFileRoute } from "@tanstack/react-router";
import { Configuracoes } from "@/features/configuracoes/configuracoes";

export const Route = createFileRoute("/configuracoes")({
	component: Configuracoes,
});
