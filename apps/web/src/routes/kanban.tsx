import { createFileRoute } from "@tanstack/react-router";
import { Kanban } from "@/features/kanban/kanban";

export const Route = createFileRoute("/kanban")({
	component: Kanban,
});
