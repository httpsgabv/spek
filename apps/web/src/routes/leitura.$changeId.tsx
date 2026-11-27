import { createFileRoute } from "@tanstack/react-router";
import { Leitura } from "@/features/leitura/leitura";

export const Route = createFileRoute("/leitura/$changeId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { changeId } = Route.useParams();
	return <Leitura changeId={changeId} />;
}
