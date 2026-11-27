import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import {
	type ChangeStage,
	ChangeStageDot,
	changeStages,
} from "@spek/ui/components/change-stage";
import { Progress } from "@spek/ui/components/progress";
import { cn } from "@spek/ui/lib/utils";

type ChangesByStageCardProps = {
	stages: { stage: ChangeStage; count: number; label?: string }[];
	capabilities: { name: string; requirements: number }[];
};

function ChangesByStageCard({ stages, capabilities }: ChangesByStageCardProps) {
	const total = stages.reduce((sum, item) => sum + item.count, 0);
	const maxRequirements = Math.max(
		...capabilities.map((item) => item.requirements),
		1,
	);
	const percent = (count: number) =>
		total ? Math.round((count / total) * 100) : 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Changes por estágio</CardTitle>
				<CardDescription className="text-xs">
					Derivado dos arquivos e do progresso em tasks.md
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex h-2.5 gap-0.5" aria-hidden="true">
					{stages.map((item) => (
						<div
							key={item.stage}
							className={cn("rounded-sm", changeStages[item.stage].bg)}
							style={{ width: `${percent(item.count)}%` }}
						/>
					))}
				</div>

				<ul className="flex flex-col">
					{stages.map((item) => (
						<li
							key={item.stage}
							className="flex items-center gap-2.5 border-b py-2 last:border-b-0"
						>
							<ChangeStageDot
								stage={item.stage}
								className="size-2 rounded-xs"
							/>
							<span className="flex-1">
								{item.label ?? changeStages[item.stage].label}
							</span>
							<span className="font-mono text-muted-foreground text-xs">
								{percent(item.count)}%
							</span>
							<span className="w-5 text-right font-mono">{item.count}</span>
						</li>
					))}
				</ul>

				<div className="flex flex-col gap-2.5">
					<span className="text-muted-foreground text-xs">
						Requisitos por capability
					</span>
					{capabilities.map((item) => (
						<div key={item.name} className="flex items-center gap-2.5 text-xs">
							<span className="w-24 truncate font-mono">{item.name}</span>
							<Progress
								value={(item.requirements / maxRequirements) * 100}
								aria-label={`Requisitos em ${item.name}`}
								className="h-2 *:data-[slot=progress-indicator]:bg-muted-foreground/50"
							/>
							<span className="w-5 text-right font-mono">
								{item.requirements}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export { ChangesByStageCard, type ChangesByStageCardProps };
