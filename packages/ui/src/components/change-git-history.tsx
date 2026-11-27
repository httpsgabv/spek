import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Button } from "@spek/ui/components/button";
import { Card, CardContent } from "@spek/ui/components/card";
import {
	DiffStat,
	GitDiff,
	type GitDiffHunk,
	type GitDiffView,
} from "@spek/ui/components/git-diff";
import { Separator } from "@spek/ui/components/separator";
import { ToggleGroup, ToggleGroupItem } from "@spek/ui/components/toggle-group";
import { cn } from "@spek/ui/lib/utils";
import { GitBranch } from "lucide-react";
import { useId, useState } from "react";

type GitCommitFile = {
	path: string;
	additions: number;
	deletions: number;
	/** Resumo do que mudou, ex.: `2 tasks marcadas`. */
	note?: string;
	hunks?: GitDiffHunk[];
	hiddenLines?: number;
};

type GitCommit = {
	hash: string;
	/** Iniciais de quem fez o commit. */
	author: string;
	authorName: string;
	message: string;
	/** Data relativa, para a lista (ex.: `há 2 h`). */
	when: string;
	/** Data completa, para o detalhe (ex.: `hoje, 13:12`). */
	date: string;
	additions: number;
	deletions: number;
	files: GitCommitFile[];
};

type GitBranchContributor = {
	initials: string;
	name: string;
	commits: number;
	additions: number;
	deletions: number;
};

type GitBranchSummary = {
	name: string;
	base: string;
	ahead: number;
	behind: number;
	contributors: GitBranchContributor[];
};

function AuthorAvatar({
	initials,
	className,
}: {
	initials: string;
	className?: string;
}) {
	return (
		<Avatar size="sm" className={cn("size-5", className)}>
			<AvatarFallback className="bg-secondary font-semibold text-[9px] text-foreground">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
}

function BranchSummaryCard({ branch }: { branch: GitBranchSummary }) {
	return (
		<Card size="sm" className="gap-2.5 bg-muted/20 py-3 ring-border">
			<CardContent className="flex flex-col gap-2.5 px-3">
				<span className="flex items-center gap-2 font-mono text-[13px]">
					<GitBranch
						className="size-3.5 text-muted-foreground"
						aria-label="Branch"
					/>
					{branch.name}
				</span>
				<div className="flex gap-4 text-muted-foreground text-xs">
					<span>
						<span className="font-mono text-primary">↑ {branch.ahead}</span> à
						frente de {branch.base}
					</span>
					<span>
						<span className="font-mono text-foreground">↓ {branch.behind}</span>{" "}
						atrás
					</span>
				</div>
				{branch.contributors.length > 0 && (
					<>
						<Separator />
						<ul className="flex flex-col gap-1.5 text-xs">
							{branch.contributors.map((person) => (
								<li key={person.name} className="flex items-center gap-2">
									<AuthorAvatar initials={person.initials} />
									<span className="flex-1">{person.name}</span>
									<span className="font-mono text-muted-foreground">
										{person.commits}
										<span className="sr-only"> commits</span>
									</span>
									<DiffStat
										additions={person.additions}
										deletions={person.deletions}
									/>
								</li>
							))}
						</ul>
					</>
				)}
			</CardContent>
		</Card>
	);
}

function CommitList({
	commits,
	selected,
	onSelect,
}: {
	commits: GitCommit[];
	selected: string;
	onSelect: (hash: string) => void;
}) {
	return (
		<nav aria-label="Commits relacionados" className="flex flex-col gap-1">
			<div className="flex items-center justify-between px-1 pb-1.5 text-[11px] text-muted-foreground">
				<h3 className="uppercase tracking-wider">Commits relacionados</h3>
				<span>branch + menções</span>
			</div>
			{commits.map((commit) => {
				const current = commit.hash === selected;
				return (
					<Button
						key={commit.hash}
						variant="ghost"
						aria-current={current ? "true" : undefined}
						onClick={() => onSelect(commit.hash)}
						className={cn(
							"h-auto items-start justify-start gap-2.5 whitespace-normal border border-transparent p-2.5 text-left font-normal",
							current && "border-input bg-secondary/60",
						)}
					>
						<AuthorAvatar initials={commit.author} className="size-5.5" />
						<span className="flex min-w-0 flex-1 flex-col gap-0.5">
							<span className="text-[13px] leading-snug">{commit.message}</span>
							<span className="font-mono text-[11px] text-muted-foreground">
								{commit.hash} · {commit.when} ·{" "}
								<DiffStat
									additions={commit.additions}
									deletions={commit.deletions}
								/>
							</span>
						</span>
					</Button>
				);
			})}
		</nav>
	);
}

function CommitFileDiff({
	id,
	file,
	view,
}: {
	id: string;
	file: GitCommitFile;
	view: GitDiffView;
}) {
	return (
		<Card
			id={id}
			size="sm"
			className="scroll-mt-4 gap-0 overflow-hidden py-0 ring-border"
		>
			<div className="flex items-center justify-between gap-2.5 border-b bg-muted/30 px-3 py-2.5">
				<h4 className="truncate font-mono text-xs">{file.path}</h4>
				{file.note ? (
					<span className="shrink-0 font-medium text-[11px] text-primary">
						{file.note}
					</span>
				) : (
					<DiffStat
						additions={file.additions}
						deletions={file.deletions}
						className="shrink-0 text-[11px]"
					/>
				)}
			</div>
			<GitDiff
				hunks={file.hunks ?? []}
				view={view}
				hiddenLines={file.hiddenLines}
			/>
		</Card>
	);
}

function CommitDetails({ commit }: { commit: GitCommit }) {
	const baseId = useId();
	const [view, setView] = useState<GitDiffView>("unified");
	const fileId = (index: number) => `${baseId}-file-${index}`;
	const withDiff = commit.files
		.map((file, index) => ({ file, index }))
		.filter(({ file }) => file.hunks?.length);

	return (
		<section
			aria-label={`Commit ${commit.hash}`}
			className="flex min-w-0 flex-1 flex-col gap-3.5 px-5 pt-4 pb-5"
		>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<div className="flex flex-col gap-1">
					<h3 className="font-semibold text-[15px]">{commit.message}</h3>
					<span className="text-muted-foreground text-xs">
						{commit.authorName} ·{" "}
						<span className="font-mono">{commit.hash}</span> · {commit.date} ·{" "}
						{commit.files.length}{" "}
						{commit.files.length === 1 ? "arquivo" : "arquivos"}
					</span>
				</div>
				<ToggleGroup
					type="single"
					value={view}
					onValueChange={(next) => next && setView(next as GitDiffView)}
					spacing={0.5}
					size="sm"
					aria-label="Visualização do diff"
					className="rounded-lg border bg-background/60 p-0.5"
				>
					<ToggleGroupItem
						value="unified"
						className="text-muted-foreground text-xs data-[state=on]:text-foreground"
					>
						Unificado
					</ToggleGroupItem>
					<ToggleGroupItem
						value="split"
						className="text-muted-foreground text-xs data-[state=on]:text-foreground"
					>
						Lado a lado
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<ul aria-label="Arquivos do commit" className="flex flex-wrap gap-1.5">
				{commit.files.map((file, index) => (
					<li key={file.path}>
						<Button
							variant="outline"
							size="sm"
							disabled={!file.hunks?.length}
							onClick={() =>
								document
									.getElementById(fileId(index))
									?.scrollIntoView?.({ behavior: "smooth", block: "start" })
							}
							className="font-mono font-normal text-foreground/85 text-xs"
						>
							{file.path}
							<DiffStat additions={file.additions} deletions={file.deletions} />
						</Button>
					</li>
				))}
			</ul>

			{withDiff.length > 0 ? (
				withDiff.map(({ file, index }) => (
					<CommitFileDiff
						key={file.path}
						id={fileId(index)}
						file={file}
						view={view}
					/>
				))
			) : (
				<p className="rounded-lg border p-6 text-center text-muted-foreground text-sm">
					O diff deste commit ainda não foi carregado.
				</p>
			)}
		</section>
	);
}

function ChangeGitHistory({
	branch,
	commits,
}: {
	branch?: GitBranchSummary;
	commits: GitCommit[];
}) {
	const [selected, setSelected] = useState(commits[0]?.hash ?? "");
	const commit =
		commits.find((item) => item.hash === selected) ?? commits[0] ?? null;

	if (!commit) {
		return (
			<p className="p-8 text-center text-muted-foreground text-sm">
				Nenhum commit relacionado a esta change.
			</p>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col md:flex-row">
			<aside className="flex shrink-0 flex-col gap-4 border-b p-4 md:w-80 md:border-r md:border-b-0">
				{branch && <BranchSummaryCard branch={branch} />}
				<CommitList
					commits={commits}
					selected={commit.hash}
					onSelect={setSelected}
				/>
			</aside>
			<CommitDetails key={commit.hash} commit={commit} />
		</div>
	);
}

export {
	ChangeGitHistory,
	type GitBranchContributor,
	type GitBranchSummary,
	type GitCommit,
	type GitCommitFile,
};
