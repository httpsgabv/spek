import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import { type ChangeFile, ChangeFiles } from "@spek/ui/components/change-files";
import {
	type ChangeStage,
	ChangeStageDot,
	changeStages,
} from "@spek/ui/components/change-stage";
import { Progress } from "@spek/ui/components/progress";
import { ScrollArea, ScrollBar } from "@spek/ui/components/scroll-area";
import { Separator } from "@spek/ui/components/separator";
import { cn } from "@spek/ui/lib/utils";
import { TriangleAlert } from "lucide-react";
import type * as React from "react";

type KanbanChange = {
	id: string;
	title: string;
	capabilities: string[];
	files: ChangeFile[];
	tasks?: { done: number; total: number };
	warning?: string;
	author: string;
	updatedAt: string;
	href?: string;
};

type KanbanColumn = {
	stage: ChangeStage;
	hint: string;
	changes: KanbanChange[];
};

type KanbanArchivedChange = {
	id: string;
	archivedAt: string;
	href?: string;
};

type KanbanArchive = {
	total: number;
	path: string;
	changes: KanbanArchivedChange[];
	moreHref?: string;
};

type KanbanBoardProps = {
	columns: KanbanColumn[];
	archive: KanbanArchive;
};

function KanbanBoard({ columns, archive }: KanbanBoardProps) {
	return (
		<ScrollArea className="w-full pb-2.5">
			<div className="flex min-w-295 items-start gap-3">
				{columns.map((column) => (
					<KanbanStageColumn key={column.stage} column={column} />
				))}
				<KanbanArchiveColumn archive={archive} />
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}

function KanbanColumnHeader({
	dot,
	title,
	count,
	hint,
	muted,
}: {
	dot: React.ReactNode;
	title: string;
	count: number;
	hint: string;
	muted?: boolean;
}) {
	return (
		<CardHeader className="gap-1 px-1">
			<CardTitle className="flex items-center gap-2 font-semibold text-sm">
				{dot}
				<h2 className={cn(muted && "text-muted-foreground")}>{title}</h2>
				<span className="font-mono font-normal text-muted-foreground text-xs">
					{count}
				</span>
			</CardTitle>
			<CardDescription className="text-xs">{hint}</CardDescription>
		</CardHeader>
	);
}

function KanbanStageColumn({ column }: { column: KanbanColumn }) {
	const label = changeStages[column.stage].label;
	return (
		<Card
			size="sm"
			role="region"
			aria-label={label}
			className="min-w-57 flex-1 gap-2.5 bg-card/60 px-2.5"
		>
			<KanbanColumnHeader
				dot={
					<ChangeStageDot stage={column.stage} className="size-2 rounded-xs" />
				}
				title={label}
				count={column.changes.length}
				hint={column.hint}
			/>
			<CardContent className="flex flex-col gap-2.5 px-0">
				{column.changes.length ? (
					column.changes.map((change) => (
						<KanbanChangeCard
							key={change.id}
							change={change}
							stage={column.stage}
						/>
					))
				) : (
					<p className="rounded-lg border border-dashed p-3 text-center text-muted-foreground text-xs">
						Nenhuma change
					</p>
				)}
			</CardContent>
		</Card>
	);
}

function KanbanChangeCard({
	change,
	stage,
}: {
	change: KanbanChange;
	stage: ChangeStage;
}) {
	const percent = change.tasks?.total
		? (change.tasks.done / change.tasks.total) * 100
		: 0;

	const card = (
		<Card
			size="sm"
			className={cn(
				"gap-2.5 bg-muted/40",
				change.href && "transition-colors hover:bg-muted/70",
			)}
		>
			<CardHeader className="gap-1">
				<CardDescription className="font-mono text-xs">
					{change.id}
				</CardDescription>
				<CardTitle className="font-medium text-sm leading-snug">
					{change.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5">
				<div className="flex flex-wrap gap-1">
					{change.capabilities.map((capability) => (
						<Badge
							key={capability}
							variant="secondary"
							className="rounded-sm px-1.5 font-mono font-normal"
						>
							{capability}
						</Badge>
					))}
				</div>
				{change.tasks && (
					<div className="flex items-center gap-2">
						<Progress
							value={percent}
							aria-label={`Tasks de ${change.id}`}
							className={cn("h-1.5", changeStages[stage].indicator)}
						/>
						<span className="font-mono text-muted-foreground text-xs">
							{change.tasks.done}/{change.tasks.total}
						</span>
					</div>
				)}
				{change.warning && (
					<p className="flex items-center gap-1.5 text-warning text-xs">
						<TriangleAlert className="size-3" aria-hidden="true" />
						{change.warning}
					</p>
				)}
				<Separator />
				<div className="flex items-center gap-1.5">
					<ChangeFiles files={change.files} />
					<Avatar size="sm" className="ml-auto">
						<AvatarFallback className="font-semibold text-[9px] text-foreground">
							{change.author}
						</AvatarFallback>
					</Avatar>
					<span className="text-muted-foreground text-xs">
						{change.updatedAt}
					</span>
				</div>
			</CardContent>
		</Card>
	);

	if (!change.href) return card;
	return (
		<a
			href={change.href}
			className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
		>
			{card}
		</a>
	);
}

function KanbanArchiveColumn({ archive }: { archive: KanbanArchive }) {
	const remaining = archive.total - archive.changes.length;
	return (
		<Card
			size="sm"
			role="region"
			aria-label="Arquivadas"
			className="min-w-52 flex-[0.8_1_0] gap-2.5 border border-dashed bg-transparent px-2.5 ring-0"
		>
			<KanbanColumnHeader
				dot={
					<span
						aria-hidden="true"
						className="size-2 shrink-0 rounded-xs bg-ring"
					/>
				}
				title="Arquivadas"
				count={archive.total}
				hint={archive.path}
				muted
			/>
			<CardContent className="flex flex-col gap-2.5 px-0">
				{archive.changes.map((change) => (
					<Button
						key={change.id}
						variant="outline"
						className="h-auto flex-col items-start gap-1 bg-card px-3 py-2.5 font-normal"
						asChild
					>
						<a href={change.href}>
							<span className="font-mono text-muted-foreground text-xs">
								{change.archivedAt}
							</span>
							<span>{change.id}</span>
						</a>
					</Button>
				))}
				{remaining > 0 && (
					<Button
						variant="outline"
						size="sm"
						className="text-muted-foreground"
						asChild={Boolean(archive.moreHref)}
					>
						{archive.moreHref ? (
							<a href={archive.moreHref}>Ver mais {remaining}</a>
						) : (
							<>Ver mais {remaining}</>
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

export {
	type KanbanArchive,
	type KanbanArchivedChange,
	KanbanBoard,
	type KanbanBoardProps,
	type KanbanChange,
	KanbanChangeCard,
	type KanbanColumn,
};
