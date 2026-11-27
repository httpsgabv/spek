import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import { Card, CardContent } from "@spek/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@spek/ui/components/dropdown-menu";
import { DiffStat } from "@spek/ui/components/git-diff";
import { ToggleGroup, ToggleGroupItem } from "@spek/ui/components/toggle-group";
import { cn } from "@spek/ui/lib/utils";
import { ChevronDown } from "lucide-react";

type GitActivityKind = "spec" | "tasks" | "proposal" | "archive" | "code";

/** Filtro por tipo: specs, arquivos da change ou código. */
type GitActivityFilter = "tudo" | "specs" | "changes" | "codigo";

type GitActivityCommit = {
	hash: string;
	kind: GitActivityKind;
	/** Iniciais de quem fez o commit. */
	author: string;
	authorName: string;
	message: string;
	branch: string;
	change: string;
	/** Arquivos tocados, já resumidos (ex.: `a.ts · b.ts · +2`). */
	files: string;
	additions: number;
	deletions: number;
	time: string;
};

type GitActivityDay = { label: string; commits: GitActivityCommit[] };

const kinds: Record<
	GitActivityKind,
	{ label: string; className: string; filter: GitActivityFilter }
> = {
	spec: {
		label: "spec",
		className: "bg-chart-2/15 text-chart-2",
		filter: "specs",
	},
	tasks: {
		label: "tasks",
		className: "bg-chart-3/15 text-chart-3",
		filter: "changes",
	},
	proposal: {
		label: "proposal",
		className: "bg-warning/15 text-warning",
		filter: "changes",
	},
	archive: {
		label: "archive",
		className: "bg-primary/15 text-primary",
		filter: "changes",
	},
	code: {
		label: "código",
		className: "bg-secondary text-foreground/85",
		filter: "codigo",
	},
};

const filters: { value: GitActivityFilter; label: string }[] = [
	{ value: "tudo", label: "Tudo" },
	{ value: "specs", label: "Specs" },
	{ value: "changes", label: "Changes" },
	{ value: "codigo", label: "Código" },
];

function matchesFilter(kind: GitActivityKind, filter: GitActivityFilter) {
	return filter === "tudo" || kinds[kind].filter === filter;
}

function GitActivityKindBadge({ kind }: { kind: GitActivityKind }) {
	return (
		<Badge className={cn("rounded-md font-normal", kinds[kind].className)}>
			{kinds[kind].label}
		</Badge>
	);
}

const ALL = "todas";

type GitActivityFiltersProps = {
	filter: GitActivityFilter;
	onFilterChange: (value: GitActivityFilter) => void;
	branches: string[];
	/** `null` = todas. */
	branch: string | null;
	onBranchChange: (value: string | null) => void;
};

function GitActivityFilters({
	filter,
	onFilterChange,
	branches,
	branch,
	onBranchChange,
}: GitActivityFiltersProps) {
	return (
		<>
			<ToggleGroup
				type="single"
				value={filter}
				onValueChange={(next) =>
					next && onFilterChange(next as GitActivityFilter)
				}
				spacing={0.5}
				aria-label="Tipo de commit"
				className="rounded-lg border bg-card p-0.5"
			>
				{filters.map((item) => (
					<ToggleGroupItem
						key={item.value}
						value={item.value}
						className="text-muted-foreground data-[state=on]:text-foreground"
					>
						{item.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="lg" className="bg-card">
						{branch ? (
							<span className="font-mono">{branch}</span>
						) : (
							"Todas as branches"
						)}
						<ChevronDown className="text-muted-foreground" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuRadioGroup
						value={branch ?? ALL}
						onValueChange={(next) => onBranchChange(next === ALL ? null : next)}
					>
						<DropdownMenuRadioItem value={ALL}>
							Todas as branches
						</DropdownMenuRadioItem>
						<DropdownMenuSeparator />
						{branches.map((item) => (
							<DropdownMenuRadioItem
								key={item}
								value={item}
								className="font-mono text-xs"
							>
								{item}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

function ActivityRow({ commit }: { commit: GitActivityCommit }) {
	return (
		<li className="flex gap-3 border-t py-3">
			<Avatar className="size-7">
				<AvatarFallback className="bg-secondary font-semibold text-[10px] text-foreground">
					{commit.author}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-medium text-sm">{commit.message}</span>
					<GitActivityKindBadge kind={commit.kind} />
				</div>
				<div className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
					<span>{commit.authorName}</span>
					<span aria-hidden="true">·</span>
					<span className="font-mono">{commit.branch}</span>
					<span aria-hidden="true">·</span>
					<Badge
						variant="outline"
						className="rounded-md bg-accent/40 font-mono font-normal text-foreground/85"
					>
						{commit.change}
					</Badge>
				</div>
				<span className="truncate font-mono text-[11px] text-muted-foreground">
					{commit.files}
				</span>
			</div>
			<div className="flex shrink-0 flex-col items-end gap-1.5">
				<span className="font-mono text-foreground/85 text-xs">
					{commit.hash}
				</span>
				<DiffStat
					additions={commit.additions}
					deletions={commit.deletions}
					className="text-[11px]"
				/>
				<span className="text-[11px] text-muted-foreground">{commit.time}</span>
			</div>
		</li>
	);
}

function GitActivityFeed({
	days,
	filter = "tudo",
	branch = null,
	className,
}: {
	days: GitActivityDay[];
	filter?: GitActivityFilter;
	/** `null` = todas. */
	branch?: string | null;
	className?: string;
}) {
	const visible = days
		.map((day) => ({
			...day,
			commits: day.commits.filter(
				(commit) =>
					matchesFilter(commit.kind, filter) &&
					(!branch || commit.branch === branch),
			),
		}))
		.filter((day) => day.commits.length > 0);

	return (
		<Card className={cn("py-1.5", className)}>
			<CardContent className="px-4.5 pb-1.5">
				{visible.length === 0 ? (
					<p className="py-10 text-center text-muted-foreground text-sm">
						Nenhum commit com esses filtros.
					</p>
				) : (
					visible.map((day) => (
						<section key={day.label} aria-label={day.label}>
							<h2 className="pt-3.5 pb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
								{day.label}
							</h2>
							<ul>
								{day.commits.map((commit) => (
									<ActivityRow key={commit.hash} commit={commit} />
								))}
							</ul>
						</section>
					))
				)}
			</CardContent>
		</Card>
	);
}

export {
	type GitActivityCommit,
	type GitActivityDay,
	GitActivityFeed,
	type GitActivityFilter,
	GitActivityFilters,
	type GitActivityFiltersProps,
	type GitActivityKind,
	GitActivityKindBadge,
};
