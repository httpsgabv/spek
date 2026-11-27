import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import {
	type ChangeStage,
	ChangeStageLabel,
	changeStages,
} from "@spek/ui/components/change-stage";
import { Progress } from "@spek/ui/components/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@spek/ui/components/table";
import { cn } from "@spek/ui/lib/utils";

type ChangeProgress = {
	id: string;
	stage: ChangeStage;
	tasksDone: number;
	tasksTotal: number;
	author: string;
	updatedAt: string;
};

type ChangesProgressCardProps = {
	changes: ChangeProgress[];
	kanbanHref: string;
};

function ChangesProgressCard({
	changes,
	kanbanHref,
}: ChangesProgressCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Progresso das changes</CardTitle>
				<CardAction>
					<Button variant="link" size="sm" className="h-auto p-0" asChild>
						<a href={kanbanHref}>Ver no kanban →</a>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<Table className="min-w-160">
					<TableHeader>
						<TableRow className="text-xs uppercase tracking-wide">
							<TableHead className="w-[36%]">Change</TableHead>
							<TableHead>Estágio</TableHead>
							<TableHead className="w-[24%]">Tasks</TableHead>
							<TableHead>Autor</TableHead>
							<TableHead className="text-right">Alterada</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{changes.map((change) => {
							const percent = change.tasksTotal
								? (change.tasksDone / change.tasksTotal) * 100
								: 0;
							return (
								<TableRow key={change.id}>
									<TableCell className="max-w-0 truncate font-mono text-xs">
										{change.id}
									</TableCell>
									<TableCell>
										<ChangeStageLabel stage={change.stage} />
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Progress
												value={percent}
												aria-label={`Tasks de ${change.id}`}
												className={cn(
													"h-1.5",
													changeStages[change.stage].indicator,
												)}
											/>
											<span className="w-10 text-right font-mono text-muted-foreground text-xs">
												{change.tasksDone}/{change.tasksTotal}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Avatar size="sm">
											<AvatarFallback className="font-semibold text-[10px] text-foreground">
												{change.author}
											</AvatarFallback>
										</Avatar>
									</TableCell>
									<TableCell className="text-right text-muted-foreground text-xs">
										{change.updatedAt}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export {
	type ChangeProgress,
	ChangesProgressCard,
	type ChangesProgressCardProps,
};
