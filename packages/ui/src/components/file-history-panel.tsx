import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Button } from "@spek/ui/components/button";
import { Card, CardContent } from "@spek/ui/components/card";
import { Label } from "@spek/ui/components/label";
import { Switch } from "@spek/ui/components/switch";
import { cn } from "@spek/ui/lib/utils";
import { Check } from "lucide-react";
import { type ReactNode, useId } from "react";

type FileContributor = {
	initials: string;
	name: string;
	percent: number;
	lines: number;
	/** Autor de alteração recente; usa a cor de destaque. */
	recent?: boolean;
};

type FileCommit = {
	hash: string;
	message: string;
	author: string;
	when: string;
	href?: string;
};

type FileBranch = { name: string; current?: boolean; contains: boolean };

type FileHistoryPanelProps = {
	fileName: string;
	showBlame: boolean;
	onShowBlameChange: (value: boolean) => void;
	contributors: FileContributor[];
	commits: FileCommit[];
	branches: FileBranch[];
	className?: string;
};

function SectionTitle({ children }: { children: ReactNode }) {
	return (
		<h3 className="text-[11px] text-muted-foreground uppercase tracking-wider">
			{children}
		</h3>
	);
}

function CommitRow({ commit }: { commit: FileCommit }) {
	const content = (
		<>
			<span
				aria-hidden="true"
				className="mt-1.5 size-2 shrink-0 rounded-full border-2 border-ring"
			/>
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="text-[13px] leading-snug">{commit.message}</span>
				<span className="font-mono text-[11px] text-muted-foreground">
					{commit.hash} · {commit.author} · {commit.when}
				</span>
			</span>
		</>
	);
	const className =
		"h-auto w-full items-start justify-start gap-2.5 whitespace-normal rounded-none border-b px-0 py-2 text-left font-normal";

	return commit.href ? (
		<Button variant="ghost" asChild className={className}>
			<a href={commit.href}>{content}</a>
		</Button>
	) : (
		<div className={cn("flex", className)}>{content}</div>
	);
}

function FileHistoryPanel({
	fileName,
	showBlame,
	onShowBlameChange,
	contributors,
	commits,
	branches,
	className,
}: FileHistoryPanelProps) {
	const switchId = useId();

	return (
		<aside
			aria-label="Histórico do arquivo"
			className={cn("flex flex-col gap-5 bg-sidebar px-4 py-5", className)}
		>
			<div className="flex items-center justify-between gap-2.5">
				<h2 className="font-semibold text-[13px]">Histórico do arquivo</h2>
				<span className="font-mono text-[11px] text-muted-foreground">
					{fileName}
				</span>
			</div>

			<Card size="sm" className="py-2.5 ring-border">
				<CardContent className="flex items-center justify-between gap-2.5 px-3">
					<Label htmlFor={switchId} className="font-normal text-[13px]">
						Autoria na margem
					</Label>
					<Switch
						id={switchId}
						checked={showBlame}
						onCheckedChange={onShowBlameChange}
					/>
				</CardContent>
			</Card>

			{contributors.length > 0 && (
				<section className="flex flex-col gap-2.5">
					<SectionTitle>Contribuidores (git blame)</SectionTitle>
					<div
						aria-hidden="true"
						className="flex h-2 gap-0.5 overflow-hidden rounded-full"
					>
						{contributors.map((person) => (
							<span
								key={person.name}
								style={{ width: `${person.percent}%` }}
								className={person.recent ? "bg-primary" : "bg-foreground/80"}
							/>
						))}
					</div>
					<ul className="flex flex-col gap-2">
						{contributors.map((person) => (
							<li
								key={person.name}
								className="flex items-center gap-2 text-[13px]"
							>
								<Avatar size="sm" className="size-5.5">
									<AvatarFallback
										className={cn(
											"bg-secondary font-semibold text-[9px]",
											person.recent
												? "border border-primary text-primary"
												: "text-foreground",
										)}
									>
										{person.initials}
									</AvatarFallback>
								</Avatar>
								<span className="flex-1">{person.name}</span>
								<span className="font-mono text-muted-foreground text-xs">
									{person.percent}% · {person.lines} linhas
								</span>
							</li>
						))}
					</ul>
				</section>
			)}

			{commits.length > 0 && (
				<section className="flex flex-col">
					<SectionTitle>Commits neste arquivo</SectionTitle>
					<ul className="flex flex-col pt-2">
						{commits.map((commit) => (
							<li key={commit.hash}>
								<CommitRow commit={commit} />
							</li>
						))}
					</ul>
				</section>
			)}

			{branches.length > 0 && (
				<section className="flex flex-col gap-2">
					<SectionTitle>Presente nas branches</SectionTitle>
					<ul className="flex flex-col gap-2">
						{branches.map((branch) => (
							<li
								key={branch.name}
								className="flex items-center justify-between rounded-lg border bg-card px-2.5 py-2 text-xs"
							>
								<span className="font-mono">{branch.name}</span>
								{branch.contains ? (
									<span className="flex items-center gap-1 text-primary">
										<Check className="size-3.5" aria-hidden="true" />
										{branch.current ? "atual" : "presente"}
									</span>
								) : (
									<span className="text-muted-foreground">ainda não</span>
								)}
							</li>
						))}
					</ul>
				</section>
			)}
		</aside>
	);
}

export {
	type FileBranch,
	type FileCommit,
	type FileContributor,
	FileHistoryPanel,
	type FileHistoryPanelProps,
};
