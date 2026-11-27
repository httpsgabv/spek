import { useConsultarHealth } from "@spek/contracts";
import { Badge } from "@spek/ui/components/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";

export function StatusApi() {
	const { isPending, isError } = useConsultarHealth();

	const status = isPending ? "Verificando" : isError ? "Fora do ar" : "Online";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					API
					<Badge variant={isError ? "destructive" : "secondary"}>
						{status}
					</Badge>
				</CardTitle>
				<CardDescription>apps/api · GET /api/health</CardDescription>
			</CardHeader>
		</Card>
	);
}
