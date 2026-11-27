import { createFileRoute } from "@tanstack/react-router";
import { Rascunhos } from "@/features/rascunhos/rascunhos";

export const Route = createFileRoute("/rascunhos")({
	component: Rascunhos,
});
