import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import type { ReaderFontSize } from "@spek/ui/components/reader-header";
import { Separator } from "@spek/ui/components/separator";
import {
	NormativeText,
	type SpecRequirement,
	SpecScenarioBlock,
} from "@spek/ui/components/spec-deltas";
import { cn } from "@spek/ui/lib/utils";
import { GitPullRequestArrow } from "lucide-react";

/** Change ativa com delta nesta spec. */
type SpecReaderChange = { id: string; href: string };

type SpecReaderProps = {
	/** Capability, ex.: `card` (arquivo `specs/card/spec.md`). */
	capability: string;
	purpose: string;
	requirements: SpecRequirement[];
	/** Changes ativas que alteram esta spec. */
	changes?: SpecReaderChange[];
	/** Última alteração do arquivo, já formatada. */
	updated?: string;
	fontSize?: ReaderFontSize;
	className?: string;
};

const textSizes: Record<ReaderFontSize, string> = {
	sm: "text-[15px]",
	md: "text-base",
	lg: "text-lg",
};

function requirementId(capability: string, index: number) {
	return `${capability}-req-${index + 1}`;
}

/** Spec atual (`openspec/specs/<capability>/spec.md`) em modo leitura. */
function SpecReader({
	capability,
	purpose,
	requirements,
	changes = [],
	updated,
	fontSize = "md",
	className,
}: SpecReaderProps) {
	const textSize = textSizes[fontSize];
	const scenarios = requirements.reduce(
		(total, requirement) => total + (requirement.scenarios?.length ?? 0),
		0,
	);

	return (
		<article
			aria-labelledby={`${capability}-titulo`}
			className={cn("flex w-full max-w-180 flex-col gap-6", className)}
		>
			<header className="flex flex-col gap-3">
				<span className="font-mono text-muted-foreground text-xs">
					openspec/specs/{capability}/spec.md
				</span>
				<h1
					id={`${capability}-titulo`}
					className="font-semibold text-4xl tracking-tight"
				>
					{capability}
				</h1>
				<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
					<Badge variant="secondary" className="rounded-md font-mono">
						{requirements.length} requisitos
					</Badge>
					<Badge variant="secondary" className="rounded-md font-mono">
						{scenarios} cenários
					</Badge>
					{updated && <span>Atualizada {updated}</span>}
				</div>
				{changes.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs">
						<GitPullRequestArrow
							className="size-3.5 text-warning"
							aria-hidden="true"
						/>
						<span className="text-foreground/85">
							Em mudança por {changes.length}{" "}
							{changes.length === 1 ? "change ativa" : "changes ativas"}:
						</span>
						{changes.map((change) => (
							<Button
								key={change.id}
								variant="link"
								size="xs"
								asChild
								className="h-auto px-0.5 font-mono"
							>
								<a href={change.href}>{change.id}</a>
							</Button>
						))}
					</div>
				)}
			</header>

			<section
				aria-labelledby={`${capability}-purpose`}
				className="flex flex-col gap-2"
			>
				<h2
					id={`${capability}-purpose`}
					className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
				>
					Purpose
				</h2>
				<p className={cn("text-foreground/85 leading-[1.75]", textSize)}>
					{purpose}
				</p>
			</section>

			{requirements.length > 0 && (
				<nav aria-label="Requisitos" className="flex flex-col gap-1">
					{requirements.map((requirement, index) => (
						<Button
							key={requirement.title}
							variant="ghost"
							size="sm"
							asChild
							className="h-auto justify-start py-1 font-normal text-muted-foreground"
						>
							<a href={`#${requirementId(capability, index)}`}>
								<span className="w-5 font-mono text-[11px]">{index + 1}</span>
								{requirement.title}
							</a>
						</Button>
					))}
				</nav>
			)}

			<Separator />

			<div className="flex flex-col gap-10">
				{requirements.map((requirement, index) => (
					<section
						key={requirement.title}
						id={requirementId(capability, index)}
						aria-labelledby={`${requirementId(capability, index)}-titulo`}
						className="flex scroll-mt-4 flex-col gap-3"
					>
						<h2
							id={`${requirementId(capability, index)}-titulo`}
							className="font-semibold text-xl tracking-tight"
						>
							Requirement: {requirement.title}
						</h2>
						<p className={cn("text-foreground/85 leading-[1.75]", textSize)}>
							<NormativeText text={requirement.text} />
						</p>
						{requirement.scenarios?.map((scenario) => (
							<SpecScenarioBlock key={scenario.title} scenario={scenario} />
						))}
					</section>
				))}
			</div>
		</article>
	);
}

export { SpecReader, type SpecReaderChange, type SpecReaderProps };
