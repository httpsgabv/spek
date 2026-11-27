import { ScrollArea, ScrollBar } from "@spek/ui/components/scroll-area";
import { cn } from "@spek/ui/lib/utils";

type GitDiffLine = {
	kind: "context" | "add" | "del";
	/** Número da linha no arquivo antigo (contexto e removidas). */
	oldNumber?: number;
	/** Número da linha no arquivo novo (contexto e adicionadas). */
	newNumber?: number;
	text: string;
};

type GitDiffHunk = {
	/** Cabeçalho do hunk, ex.: `@@ -8,7 +8,7 @@ ## 2. Interação`. */
	header: string;
	lines: GitDiffLine[];
};

type GitDiffView = "unified" | "split";

const lineStyles: Record<
	GitDiffLine["kind"],
	{ row: string; sign: string; mark: string; label?: string }
> = {
	context: { row: "", sign: "text-muted-foreground/60", mark: "" },
	add: {
		row: "bg-primary/10",
		sign: "text-primary",
		mark: "+",
		label: "Adicionada",
	},
	del: {
		row: "bg-destructive/10",
		sign: "text-destructive",
		mark: "−",
		label: "Removida",
	},
};

function LineNumber({ value }: { value?: number }) {
	return (
		<span className="w-9.5 shrink-0 select-none pr-2 text-right text-muted-foreground/60">
			{value}
		</span>
	);
}

function LineSign({ kind }: { kind: GitDiffLine["kind"] }) {
	const style = lineStyles[kind];
	return (
		<span className={cn("w-4.5 shrink-0 select-none", style.sign)}>
			{style.label && <span className="sr-only">{style.label}: </span>}
			<span aria-hidden="true">{style.mark}</span>
		</span>
	);
}

function UnifiedLines({ lines }: { lines: GitDiffLine[] }) {
	return lines.map((line, index) => (
		<div
			// biome-ignore lint/suspicious/noArrayIndexKey: linhas de um diff fixo
			key={index}
			className={cn("flex", lineStyles[line.kind].row)}
		>
			<LineNumber value={line.oldNumber} />
			<LineNumber value={line.newNumber} />
			<LineSign kind={line.kind} />
			<span className="whitespace-pre text-foreground/85">{line.text}</span>
		</div>
	));
}

type SplitRow = { left?: GitDiffLine; right?: GitDiffLine };

/** Alinha removidas à esquerda e adicionadas à direita, bloco a bloco. */
function toSplitRows(lines: GitDiffLine[]): SplitRow[] {
	const rows: SplitRow[] = [];
	let removed: GitDiffLine[] = [];
	let added: GitDiffLine[] = [];

	function flush() {
		for (let i = 0; i < Math.max(removed.length, added.length); i++) {
			rows.push({ left: removed[i], right: added[i] });
		}
		removed = [];
		added = [];
	}

	for (const line of lines) {
		if (line.kind === "del") removed.push(line);
		else if (line.kind === "add") added.push(line);
		else {
			flush();
			rows.push({ left: line, right: line });
		}
	}
	flush();
	return rows;
}

function SplitSide({
	line,
	side,
}: {
	line?: GitDiffLine;
	side: "left" | "right";
}) {
	if (!line) return <div className="bg-muted/30" />;
	return (
		<div className={cn("flex min-w-0", lineStyles[line.kind].row)}>
			<LineNumber value={side === "left" ? line.oldNumber : line.newNumber} />
			<LineSign kind={line.kind} />
			<span className="whitespace-pre text-foreground/85">{line.text}</span>
		</div>
	);
}

function SplitLines({ lines }: { lines: GitDiffLine[] }) {
	return (
		<div className="grid grid-cols-2 divide-x">
			{toSplitRows(lines).map((row, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: linhas de um diff fixo
				<div key={index} className="contents">
					<SplitSide line={row.left} side="left" />
					<SplitSide line={row.right} side="right" />
				</div>
			))}
		</div>
	);
}

function GitDiff({
	hunks,
	view = "unified",
	hiddenLines,
}: {
	hunks: GitDiffHunk[];
	view?: GitDiffView;
	/** Linhas alteradas que não vieram no diff resumido. */
	hiddenLines?: number;
}) {
	return (
		<ScrollArea className="bg-background">
			<div className="min-w-140 font-mono text-xs leading-[1.75]">
				{hunks.map((hunk) => (
					<div key={hunk.header}>
						<div className="bg-chart-3/5 px-3 py-1 text-muted-foreground">
							{hunk.header}
						</div>
						{view === "split" ? (
							<SplitLines lines={hunk.lines} />
						) : (
							<UnifiedLines lines={hunk.lines} />
						)}
					</div>
				))}
				{hiddenLines ? (
					<div className="border-t px-3 py-1.5 text-muted-foreground">
						Mais {hiddenLines} linhas alteradas
					</div>
				) : null}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}

/** Contagem `+N −M` de linhas adicionadas e removidas. */
function DiffStat({
	additions,
	deletions,
	className,
}: {
	additions: number;
	deletions: number;
	className?: string;
}) {
	return (
		<span className={cn("font-mono", className)}>
			<span className="text-primary">+{additions}</span>{" "}
			<span className="text-destructive">−{deletions}</span>
		</span>
	);
}

export {
	DiffStat,
	GitDiff,
	type GitDiffHunk,
	type GitDiffLine,
	type GitDiffView,
};
