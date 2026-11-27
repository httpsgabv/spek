import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@spek/ui/components/collapsible";
import { ScrollArea } from "@spek/ui/components/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@spek/ui/components/toggle-group";
import { cn } from "@spek/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { useId, useState } from "react";

type SpecDeltaOperation = "ADDED" | "MODIFIED" | "REMOVED" | "RENAMED";

type SpecScenarioStep = {
	keyword: "GIVEN" | "WHEN" | "THEN" | "AND";
	text: string;
};

type SpecScenario = {
	title: string;
	steps: SpecScenarioStep[];
};

type SpecRequirement = {
	title: string;
	text: string;
	/** Texto anterior do requisito, para deltas MODIFIED. */
	previousText?: string;
	scenarios?: SpecScenario[];
};

type SpecDeltaGroup = {
	operation: SpecDeltaOperation;
	requirements: SpecRequirement[];
};

type SpecDeltaFile = {
	/** Capability da spec, ex.: `card` (arquivo `card/spec.md`). */
	capability: string;
	groups: SpecDeltaGroup[];
};

const operations: Record<
	SpecDeltaOperation,
	{ badge: string; summary: string; sign: string }
> = {
	ADDED: {
		badge: "bg-primary/15 text-primary",
		summary: "text-primary",
		sign: "+",
	},
	MODIFIED: {
		badge: "bg-chart-3/15 text-chart-3",
		summary: "text-chart-3",
		sign: "~",
	},
	REMOVED: {
		badge: "bg-destructive/15 text-destructive",
		summary: "text-destructive",
		sign: "−",
	},
	RENAMED: {
		badge: "bg-chart-2/15 text-chart-2",
		summary: "text-chart-2",
		sign: "→",
	},
};

const operationOrder: SpecDeltaOperation[] = [
	"ADDED",
	"MODIFIED",
	"REMOVED",
	"RENAMED",
];

const stepColors: Record<SpecScenarioStep["keyword"], string> = {
	GIVEN: "text-muted-foreground",
	WHEN: "text-chart-3",
	THEN: "text-primary",
	AND: "text-muted-foreground",
};

const normativeKeywords =
	/\b(SHALL NOT|SHALL|MUST NOT|MUST|SHOULD NOT|SHOULD)\b/;

/** Destaca as palavras normativas (SHALL, MUST...) do texto do requisito. */
function NormativeText({ text }: { text: string }) {
	return text.split(normativeKeywords).map((part, index) =>
		index % 2 === 1 ? (
			<strong
				// biome-ignore lint/suspicious/noArrayIndexKey: partes fixas do mesmo texto
				key={index}
				className="font-medium font-mono text-foreground"
			>
				{part}
			</strong>
		) : (
			part
		),
	);
}

function specFilePath(capability: string) {
	return `${capability}/spec.md`;
}

function countByOperation(file: SpecDeltaFile) {
	const counts = new Map<SpecDeltaOperation, number>();
	for (const group of file.groups) {
		counts.set(
			group.operation,
			(counts.get(group.operation) ?? 0) + group.requirements.length,
		);
	}
	return operationOrder
		.filter((operation) => counts.get(operation))
		.map((operation) => ({ operation, count: counts.get(operation) ?? 0 }));
}

function SpecDeltaOperationBadge({
	operation,
}: {
	operation: SpecDeltaOperation;
}) {
	return (
		<Badge
			className={cn(
				"rounded-sm px-1.5 font-bold text-[11px] tracking-wider",
				operations[operation].badge,
			)}
		>
			{operation}
		</Badge>
	);
}

function SpecScenarioBlock({ scenario }: { scenario: SpecScenario }) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border bg-background/60 px-3.5 py-3">
			<h4 className="font-semibold text-muted-foreground text-xs">
				Scenario: {scenario.title}
			</h4>
			<dl className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2.5 gap-y-1.5 text-[13px] leading-normal">
				{scenario.steps.map((step, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: passos podem repetir a palavra-chave
					<div key={index} className="contents">
						<dt
							className={cn(
								"pt-0.5 font-medium font-mono text-[11px]",
								stepColors[step.keyword],
							)}
						>
							{step.keyword}
						</dt>
						<dd>{step.text}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

function SpecRequirementCard({
	id,
	requirement,
	operation,
}: {
	id: string;
	requirement: SpecRequirement;
	operation: SpecDeltaOperation;
}) {
	const [view, setView] = useState<"compare" | "new">("compare");
	const scenarios = requirement.scenarios ?? [];
	const showDiff =
		operation === "MODIFIED" && requirement.previousText !== undefined;

	return (
		<Card
			id={id}
			size="sm"
			className="scroll-mt-4 gap-3 bg-muted/20 px-1 ring-border"
		>
			<CardHeader className="flex flex-wrap items-center justify-between gap-2.5">
				<CardTitle>
					<h3 className="font-semibold text-[17px]">
						Requirement: {requirement.title}
					</h3>
				</CardTitle>
				{showDiff && (
					<ToggleGroup
						type="single"
						value={view}
						onValueChange={(next) => next && setView(next as "compare" | "new")}
						spacing={0.5}
						size="sm"
						aria-label="Visualização do requisito"
						className="rounded-lg border bg-background/60 p-0.5"
					>
						<ToggleGroupItem
							value="compare"
							className="text-muted-foreground text-xs data-[state=on]:text-foreground"
						>
							Comparar
						</ToggleGroupItem>
						<ToggleGroupItem
							value="new"
							className="text-muted-foreground text-xs data-[state=on]:text-foreground"
						>
							Só o novo
						</ToggleGroupItem>
					</ToggleGroup>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{showDiff ? (
					<div className="flex flex-col gap-1 overflow-hidden rounded-lg border text-sm leading-relaxed">
						{view === "compare" && (
							<p className="bg-destructive/10 px-3 py-2">
								<span className="mr-2 font-mono text-destructive">
									<span className="sr-only">Removido: </span>
									<span aria-hidden="true">−</span>
								</span>
								<NormativeText text={requirement.previousText ?? ""} />
							</p>
						)}
						<p className="bg-primary/10 px-3 py-2">
							<span className="mr-2 font-mono text-primary">
								<span className="sr-only">Adicionado: </span>
								<span aria-hidden="true">+</span>
							</span>
							<NormativeText text={requirement.text} />
						</p>
					</div>
				) : (
					<p className="text-sm leading-relaxed">
						<NormativeText text={requirement.text} />
					</p>
				)}
				{scenarios.length > 0 && (
					<SpecScenarios
						scenarios={scenarios}
						collapsed={operation !== "ADDED"}
					/>
				)}
			</CardContent>
		</Card>
	);
}

function SpecScenarios({
	scenarios,
	collapsed,
}: {
	scenarios: SpecScenario[];
	collapsed: boolean;
}) {
	const [open, setOpen] = useState(!collapsed);
	const label = `${scenarios.length} ${scenarios.length === 1 ? "cenário" : "cenários"}`;

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="flex flex-col gap-2"
		>
			<CollapsibleTrigger asChild>
				<Button
					variant="ghost"
					size="xs"
					className="w-fit px-1 text-muted-foreground"
				>
					<ChevronRight
						aria-hidden="true"
						className={cn("transition-transform", open && "rotate-90")}
					/>
					{label}
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="flex flex-col gap-2">
				{scenarios.map((scenario) => (
					<SpecScenarioBlock key={scenario.title} scenario={scenario} />
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}

function SpecDeltas({ files }: { files: SpecDeltaFile[] }) {
	const baseId = useId();
	const [selected, setSelected] = useState(files[0]?.capability);
	const [activeRequirement, setActiveRequirement] = useState(0);

	const file = files.find((item) => item.capability === selected) ?? files[0];
	if (!file) {
		return (
			<p className="p-8 text-center text-muted-foreground text-sm">
				Esta change não tem deltas de spec.
			</p>
		);
	}

	const requirements = file.groups.flatMap((group) =>
		group.requirements.map((requirement) => ({
			requirement,
			operation: group.operation,
		})),
	);
	const requirementId = (index: number) =>
		`${baseId}-${file.capability}-req-${index}`;

	function goToRequirement(index: number) {
		setActiveRequirement(index);
		document
			.getElementById(requirementId(index))
			?.scrollIntoView?.({ behavior: "smooth", block: "start" });
	}

	let index = -1;

	return (
		<div className="flex min-h-0 flex-1 flex-col md:flex-row">
			<aside className="flex shrink-0 flex-col gap-4 border-b px-3.5 py-4 md:w-60 md:border-r md:border-b-0">
				<nav aria-label="Deltas" className="flex flex-col gap-1">
					<h3 className="px-2 pb-1 text-[11px] text-muted-foreground uppercase tracking-wider">
						Deltas
					</h3>
					{files.map((item) => {
						const current = item.capability === file.capability;
						return (
							<Button
								key={item.capability}
								variant={current ? "secondary" : "ghost"}
								aria-current={current ? "true" : undefined}
								onClick={() => {
									setSelected(item.capability);
									setActiveRequirement(0);
								}}
								className={cn(
									"justify-start gap-2 px-2 font-mono font-normal text-xs",
									!current && "text-muted-foreground",
								)}
							>
								<span className="flex-1 text-left">
									{specFilePath(item.capability)}
								</span>
								{countByOperation(item).map(({ operation, count }) => (
									<span
										key={operation}
										className={operations[operation].summary}
									>
										{operations[operation].sign}
										{count}
									</span>
								))}
							</Button>
						);
					})}
				</nav>

				{requirements.length > 0 && (
					<nav aria-label="Nesta página" className="flex flex-col">
						<h3 className="px-2 pb-1.5 text-[11px] text-muted-foreground uppercase tracking-wider">
							Nesta página
						</h3>
						{requirements.map(({ requirement }, itemIndex) => (
							<Button
								key={requirement.title}
								variant="ghost"
								size="sm"
								aria-current={
									itemIndex === activeRequirement ? "location" : undefined
								}
								onClick={() => goToRequirement(itemIndex)}
								className={cn(
									"h-auto justify-start whitespace-normal rounded-none border-l-2 px-2 py-1.5 text-left font-normal text-xs",
									itemIndex === activeRequirement
										? "border-primary text-foreground"
										: "border-input text-muted-foreground",
								)}
							>
								{requirement.title}
							</Button>
						))}
					</nav>
				)}

				<p className="mt-auto rounded-lg border bg-muted/30 p-2.5 text-muted-foreground text-xs leading-snug">
					Ao arquivar, estes deltas são aplicados em{" "}
					<span className="font-mono text-foreground/85">
						openspec/specs/{specFilePath(file.capability)}
					</span>
					.
				</p>
			</aside>

			<ScrollArea className="min-h-0 min-w-0 flex-1">
				<article
					aria-label={specFilePath(file.capability)}
					className="flex max-w-205 flex-col gap-4.5 px-5 pt-5 pb-7 md:px-7"
				>
					{file.groups.map((group) => (
						<section
							key={group.operation}
							className="flex flex-col gap-4.5"
							aria-label={`${group.operation} Requirements`}
						>
							<div className="flex items-center gap-2.5">
								<SpecDeltaOperationBadge operation={group.operation} />
								<h2 className="font-medium text-[13px] text-muted-foreground">
									Requirements
								</h2>
							</div>
							{group.requirements.map((requirement) => {
								index += 1;
								return (
									<SpecRequirementCard
										key={requirement.title}
										id={requirementId(index)}
										requirement={requirement}
										operation={group.operation}
									/>
								);
							})}
						</section>
					))}
				</article>
			</ScrollArea>
		</div>
	);
}

export {
	type SpecDeltaFile,
	type SpecDeltaGroup,
	type SpecDeltaOperation,
	SpecDeltaOperationBadge,
	SpecDeltas,
	type SpecRequirement,
	type SpecScenario,
	type SpecScenarioStep,
};
