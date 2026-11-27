import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import { cn } from "@spek/ui/lib/utils";
import { GitBranch } from "lucide-react";

type ActiveBranch = {
	name: string;
	ahead: number;
	behind: number;
	/** Change ligada à branch e situação (ex.: `8/14 tasks`). */
	note: string;
};

function ActiveBranchesCard({ branches }: { branches: ActiveBranch[] }) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader>
				<CardTitle>Branches ativas</CardTitle>
				<CardAction className="font-mono text-muted-foreground text-xs">
					{branches.length}
				</CardAction>
			</CardHeader>
			<CardContent>
				<ul>
					{branches.map((branch) => (
						<li
							key={branch.name}
							className="flex flex-col gap-1 border-t py-2.5"
						>
							<div className="flex items-center gap-2">
								<GitBranch
									className="size-3.5 shrink-0 text-muted-foreground"
									aria-hidden="true"
								/>
								<span className="min-w-0 flex-1 truncate font-mono text-xs">
									{branch.name}
								</span>
								<span className="font-mono text-[11px] text-primary">
									<span className="sr-only">À frente: </span>↑{branch.ahead}
								</span>
								<span
									className={cn(
										"font-mono text-[11px]",
										branch.behind > 0
											? "text-warning"
											: "text-muted-foreground",
									)}
								>
									<span className="sr-only">Atrás: </span>↓{branch.behind}
								</span>
							</div>
							<span className="pl-5.5 text-[11px] text-muted-foreground">
								{branch.note}
							</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

export { type ActiveBranch, ActiveBranchesCard };
