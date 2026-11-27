import { Button } from "@spek/ui/components/button";
import { SidebarTrigger } from "@spek/ui/components/sidebar";
import { Calendar, ChevronDown, GitBranch, RefreshCw } from "lucide-react";

type DashboardHeaderProps = {
	openspecPath: string;
	branch: string;
	period: string;
	readAgo: string;
};

function DashboardHeader({
	openspecPath,
	branch,
	period,
	readAgo,
}: DashboardHeaderProps) {
	return (
		<header className="flex flex-wrap items-end justify-between gap-3 px-1.5 pt-3.5 pb-1">
			<div className="flex items-start gap-2">
				<SidebarTrigger className="mt-1 md:hidden" aria-label="Abrir menu" />
				<div className="flex flex-col gap-1">
					<h1 className="font-semibold text-3xl tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground text-sm">
						Specs e changes do OpenSpec em{" "}
						<span className="font-mono text-foreground">{openspecPath}</span>
					</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button variant="outline" size="lg">
					<GitBranch className="text-muted-foreground" aria-hidden="true" />
					<span className="font-mono">{branch}</span>
					<ChevronDown className="text-muted-foreground" aria-hidden="true" />
				</Button>
				<Button variant="outline" size="lg">
					<Calendar className="text-muted-foreground" aria-hidden="true" />
					{period}
					<ChevronDown className="text-muted-foreground" aria-hidden="true" />
				</Button>
				<Button variant="outline" size="lg" className="text-muted-foreground">
					<RefreshCw aria-hidden="true" />
					{readAgo}
				</Button>
			</div>
		</header>
	);
}

export { DashboardHeader, type DashboardHeaderProps };
