import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import { Card, CardContent } from "@spek/ui/components/card";
import { Checkbox } from "@spek/ui/components/checkbox";
import type { ReaderFontSize } from "@spek/ui/components/reader-header";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@spek/ui/components/tooltip";
import { cn } from "@spek/ui/lib/utils";
import { useId } from "react";

/** Autoria de um trecho, vinda do `git blame`. */
type BlameAuthor = {
	initials: string;
	name: string;
	hash: string;
	/** Alteração recente, destacada na margem. */
	recent?: boolean;
};

type ReaderListItem = { text: string; tag?: string; blame?: BlameAuthor };

type ReaderBlock =
	| { type: "paragraph"; text: string }
	| { type: "list"; items: ReaderListItem[] }
	| { type: "fields"; rows: { label: string; value: string }[] };

type ReaderSection = {
	title: string;
	blame?: BlameAuthor;
	blocks: ReaderBlock[];
};

type ReaderTask = { id: string; text: string; done: boolean };

type ReaderTasks = {
	done: number;
	total: number;
	groups: { title: string; tasks: ReaderTask[] }[];
};

type ChangeReaderProps = {
	title: string;
	proposal: ReaderSection[];
	tasks?: ReaderTasks;
	/** Mostra as iniciais de quem escreveu cada trecho na margem. */
	showBlame: boolean;
	fontSize: ReaderFontSize;
};

const textSizes: Record<ReaderFontSize, string> = {
	sm: "text-[15px]",
	md: "text-base",
	lg: "text-lg",
};

/** Texto com trechos entre crases em fonte mono, como no markdown. */
function InlineText({ text }: { text: string }) {
	return text.split("`").map((part, index) =>
		index % 2 === 1 ? (
			<code
				// biome-ignore lint/suspicious/noArrayIndexKey: partes fixas do mesmo texto
				key={index}
				className="font-mono text-[0.85em]"
			>
				{part}
			</code>
		) : (
			part
		),
	);
}

function BlameMarker({
	blame,
	className,
}: {
	blame: BlameAuthor;
	className?: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					aria-label={`Escrito por ${blame.name} em ${blame.hash}`}
					className={cn(
						"absolute top-1 hidden rounded-full lg:block",
						className,
					)}
				>
					<Avatar size="sm">
						<AvatarFallback
							className={cn(
								"border bg-accent font-semibold text-[9px]",
								blame.recent
									? "border-primary text-primary"
									: "border-input text-muted-foreground",
							)}
						>
							{blame.initials}
						</AvatarFallback>
					</Avatar>
				</button>
			</TooltipTrigger>
			<TooltipContent>
				{blame.name} · <span className="font-mono">{blame.hash}</span>
			</TooltipContent>
		</Tooltip>
	);
}

function ReaderBlockView({
	block,
	showBlame,
	textSize,
}: {
	block: ReaderBlock;
	showBlame: boolean;
	textSize: string;
}) {
	if (block.type === "paragraph") {
		return (
			<p className={cn("text-foreground/85 leading-[1.75]", textSize)}>
				<InlineText text={block.text} />
			</p>
		);
	}
	if (block.type === "list") {
		return (
			<ul
				className={cn(
					"flex list-disc flex-col gap-2 pl-5.5 text-foreground/85 leading-[1.7]",
					textSize,
				)}
			>
				{block.items.map((item) => (
					<li key={item.text} className="relative">
						<InlineText text={item.text} />
						{item.tag && (
							<Badge className="ml-1.5 rounded-md bg-chart-3/15 font-mono font-normal text-chart-3">
								{item.tag}
							</Badge>
						)}
						{showBlame && item.blame && (
							<BlameMarker blame={item.blame} className="-left-16.5" />
						)}
					</li>
				))}
			</ul>
		);
	}
	return (
		<Card size="sm" className="bg-card py-4 ring-border">
			<CardContent>
				<dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 text-[15px] text-foreground/85 leading-relaxed sm:grid-cols-[8.75rem_minmax(0,1fr)]">
					{block.rows.map((row) => (
						<div key={row.label} className="contents">
							<dt className="text-muted-foreground">{row.label}</dt>
							<dd>
								<InlineText text={row.value} />
							</dd>
						</div>
					))}
				</dl>
			</CardContent>
		</Card>
	);
}

function ChangeReader({
	title,
	proposal,
	tasks,
	showBlame,
	fontSize,
}: ChangeReaderProps) {
	const baseId = useId();
	const proposalId = `${baseId}-proposal`;
	const tasksId = `${baseId}-tasks`;
	const textSize = textSizes[fontSize];

	return (
		<TooltipProvider>
			<article className="flex w-full max-w-180 flex-col gap-5.5">
				<nav
					aria-label="Arquivos da change"
					className="flex gap-0.5 self-start rounded-xl border bg-card p-0.5"
				>
					<Button variant="secondary" size="sm" asChild>
						<a href={`#${proposalId}`}>Proposal</a>
					</Button>
					{tasks && (
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="text-muted-foreground"
						>
							<a href={`#${tasksId}`}>Tasks</a>
						</Button>
					)}
				</nav>

				<header id={proposalId} className="flex scroll-mt-6 flex-col gap-2">
					<span className="font-mono text-muted-foreground text-xs">
						proposal.md
					</span>
					<h1 className="font-semibold text-[34px] leading-tight tracking-tight">
						{title}
					</h1>
				</header>

				{proposal.length === 0 && (
					<p className="text-muted-foreground text-sm">
						Esta change ainda não tem conteúdo em proposal.md.
					</p>
				)}
				{proposal.map((section) => (
					<section
						key={section.title}
						className="relative flex flex-col gap-2.5"
					>
						{showBlame && section.blame && (
							<BlameMarker blame={section.blame} className="-left-11" />
						)}
						<h2 className="font-semibold text-xl">{section.title}</h2>
						{section.blocks.map((block, index) => (
							<ReaderBlockView
								// biome-ignore lint/suspicious/noArrayIndexKey: blocos fixos da seção
								key={index}
								block={block}
								showBlame={showBlame}
								textSize={textSize}
							/>
						))}
					</section>
				))}

				{tasks && (
					<section
						id={tasksId}
						aria-label="Tasks"
						className="flex scroll-mt-6 flex-col gap-3 border-t pt-5.5"
					>
						<div className="flex items-baseline justify-between gap-2.5 font-mono text-xs">
							<span className="text-muted-foreground">tasks.md</span>
							<span className="text-chart-3">
								{tasks.done}/{tasks.total} concluídas
							</span>
						</div>
						{tasks.groups.map((group) => (
							<div key={group.title} className="flex flex-col gap-3">
								<h2 className="font-semibold text-xl">{group.title}</h2>
								<ul className="flex flex-col gap-3">
									{group.tasks.map((task) => (
										<li
											key={task.id}
											className={cn(
												"flex items-start gap-3 leading-relaxed",
												textSize === textSizes.lg ? "text-base" : "text-[15px]",
											)}
										>
											<Checkbox
												checked={task.done}
												aria-label={`Task ${task.id}`}
												aria-readonly="true"
												tabIndex={-1}
												className="pointer-events-none mt-1"
											/>
											<span className="mt-px font-mono text-[13px] text-muted-foreground">
												{task.id}
											</span>
											<span
												className={cn(task.done && "text-muted-foreground")}
											>
												{task.text}
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</section>
				)}
			</article>
		</TooltipProvider>
	);
}

export {
	type BlameAuthor,
	ChangeReader,
	type ChangeReaderProps,
	type ReaderBlock,
	type ReaderSection,
	type ReaderTask,
	type ReaderTasks,
};
