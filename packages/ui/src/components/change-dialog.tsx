import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
} from "@spek/ui/components/avatar";
import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import {
	type ChangeStage,
	ChangeStageDot,
	changeStages,
} from "@spek/ui/components/change-stage";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@spek/ui/components/dialog";
import { Progress } from "@spek/ui/components/progress";
import {
	type SpecDeltaFile,
	SpecDeltas,
} from "@spek/ui/components/spec-deltas";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@spek/ui/components/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@spek/ui/components/tooltip";
import { cn } from "@spek/ui/lib/utils";
import {
	BookOpen,
	Check,
	Copy,
	GitBranch,
	TriangleAlert,
	X,
} from "lucide-react";

type ChangeDetails = {
	id: string;
	title: string;
	stage: ChangeStage;
	branch?: string;
	tasks?: { done: number; total: number };
	capabilities: string[];
	authors: string[];
	createdAt?: string;
	validation?: { ok: boolean; message: string };
	lastChange?: { author: string; hash: string; when: string };
	commits?: number;
};

type ChangeDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	change: ChangeDetails;
	specs: SpecDeltaFile[];
	/** Link para o modo leitura; sem ele o botão não aparece. */
	readerHref?: string;
};

function ChangeDialogMeta({ change }: { change: ChangeDetails }) {
	const percent = change.tasks?.total
		? (change.tasks.done / change.tasks.total) * 100
		: 0;

	return (
		<div className="flex flex-wrap items-center gap-x-4.5 gap-y-2 text-muted-foreground text-xs">
			{change.branch && (
				<span className="flex items-center gap-1.5">
					<GitBranch className="size-3.5" aria-label="Branch" />
					<span className="font-mono text-foreground">{change.branch}</span>
				</span>
			)}
			{change.tasks && (
				<span className="flex items-center gap-2">
					Tasks
					<Progress
						value={percent}
						aria-label={`Tasks de ${change.id}`}
						className={cn("h-1.5 w-20", changeStages[change.stage].indicator)}
					/>
					<span className="font-mono text-foreground">
						{change.tasks.done}/{change.tasks.total}
					</span>
				</span>
			)}
			{change.capabilities.length > 0 && (
				<span className="flex items-center gap-1.5">
					Capabilities
					{change.capabilities.map((capability) => (
						<Badge
							key={capability}
							variant="secondary"
							className="rounded-sm px-1.5 font-mono font-normal"
						>
							{capability}
						</Badge>
					))}
				</span>
			)}
			{change.authors.length > 0 && (
				<span className="flex items-center gap-1.5">
					Autores
					<AvatarGroup className="-space-x-1.5">
						{change.authors.map((author) => (
							<Avatar key={author} size="sm" className="size-5.5">
								<AvatarFallback className="font-semibold text-[9px] text-foreground">
									{author}
								</AvatarFallback>
							</Avatar>
						))}
					</AvatarGroup>
				</span>
			)}
			{change.createdAt && <span>Criada em {change.createdAt}</span>}
			{change.validation && (
				<span
					className={cn(
						"flex items-center gap-1",
						change.validation.ok ? "text-primary" : "text-warning",
					)}
				>
					{change.validation.ok ? (
						<Check className="size-3.5" aria-hidden="true" />
					) : (
						<TriangleAlert className="size-3.5" aria-hidden="true" />
					)}
					{change.validation.message}
				</span>
			)}
		</div>
	);
}

function CopyPathButton({ path }: { path: string }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					aria-label="Copiar caminho"
					onClick={() => navigator.clipboard?.writeText(path)}
					className="text-muted-foreground"
				>
					<Copy />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Copiar caminho</TooltipContent>
		</Tooltip>
	);
}

const tabTriggerClass =
	"flex-none rounded-none px-3 py-2.5 font-normal text-[13px] after:bg-primary data-active:font-semibold";

function ChangeDialog({
	open,
	onOpenChange,
	change,
	specs,
	readerHref,
}: ChangeDialogProps) {
	const path = `openspec/changes/${change.id}`;
	const stage = changeStages[change.stage];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[calc(100dvh-5rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-card p-0 shadow-2xl ring-input sm:max-w-280"
			>
				<TooltipProvider>
					<Tabs defaultValue="specs" className="min-h-0 flex-1 gap-0">
						<DialogHeader className="gap-3.5 px-5.5 pt-4.5">
							<div className="flex flex-wrap items-center justify-between gap-2.5">
								<span className="font-mono text-muted-foreground text-xs">
									openspec/changes/
									<span className="text-foreground/85">{change.id}</span>
								</span>
								<div className="flex gap-1.5">
									{readerHref && (
										<Button variant="outline" asChild>
											<a href={readerHref}>
												<BookOpen data-icon="inline-start" />
												Modo leitura
											</a>
										</Button>
									)}
									<CopyPathButton path={path} />
									<DialogClose asChild>
										<Button
											variant="outline"
											size="icon"
											aria-label="Fechar"
											className="text-muted-foreground"
										>
											<X />
										</Button>
									</DialogClose>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<DialogTitle className="font-semibold text-2xl tracking-tight">
									{change.title}
								</DialogTitle>
								<Badge className={cn("rounded-md", stage.soft, stage.text)}>
									<ChangeStageDot stage={change.stage} />
									{stage.label}
								</Badge>
							</div>
							<DialogDescription className="sr-only">
								Arquivos e deltas de spec da change {change.id}
							</DialogDescription>

							<ChangeDialogMeta change={change} />

							<TabsList
								variant="line"
								aria-label="Arquivos da change"
								className="h-auto w-full justify-start overflow-x-auto border-b p-0"
							>
								<TabsTrigger
									value="proposal"
									disabled
									className={tabTriggerClass}
								>
									Proposal
								</TabsTrigger>
								<TabsTrigger value="specs" className={tabTriggerClass}>
									Specs
									<span className="font-mono font-normal text-[11px] text-muted-foreground">
										{specs.length}
									</span>
								</TabsTrigger>
								<TabsTrigger
									value="design"
									disabled
									className={tabTriggerClass}
								>
									Design
								</TabsTrigger>
								<TabsTrigger value="tasks" disabled className={tabTriggerClass}>
									Tasks
									{change.tasks && (
										<span className="font-mono font-normal text-[11px]">
											{change.tasks.done}/{change.tasks.total}
										</span>
									)}
								</TabsTrigger>
								<TabsTrigger value="git" disabled className={tabTriggerClass}>
									Git
									{change.commits !== undefined && (
										<span className="font-mono font-normal text-[11px]">
											{change.commits} commits
										</span>
									)}
								</TabsTrigger>
							</TabsList>
						</DialogHeader>

						<TabsContent value="specs" className="flex min-h-0 md:min-h-140">
							<SpecDeltas files={specs} />
						</TabsContent>
					</Tabs>
				</TooltipProvider>

				{change.lastChange && (
					<DialogFooter className="mx-0 mb-0 flex-row flex-wrap items-center justify-between gap-2.5 rounded-none bg-transparent px-5.5 py-3 text-muted-foreground text-xs sm:justify-between">
						<span>
							Última alteração por{" "}
							<span className="text-foreground">
								{change.lastChange.author}
							</span>{" "}
							· <span className="font-mono">{change.lastChange.hash}</span> ·{" "}
							{change.lastChange.when}
						</span>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}

export { type ChangeDetails, ChangeDialog, type ChangeDialogProps };
