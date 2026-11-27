import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@spek/ui/components/input-group";
import { cn } from "@spek/ui/lib/utils";
import {
	ArrowUp,
	Check,
	Copy,
	FileText,
	Plus,
	RotateCw,
	Sparkles,
	Square,
} from "lucide-react";
import type * as React from "react";

type AssistantConversation = { id: string; title: string };

type AssistantConversationGroup = {
	label: string;
	conversations: AssistantConversation[];
};

type AssistantCitation = { n: number; label: string; href: string };

type AssistantMessage =
	| { id: string; role: "user"; content: React.ReactNode }
	| {
			id: string;
			role: "assistant";
			/** Leituras feitas pelo agente (arquivos, comandos git). */
			steps: { label: string; done: boolean }[];
			content?: React.ReactNode;
			citations?: AssistantCitation[];
			/** Resposta ainda sendo gerada. */
			pending?: boolean;
	  };

type AssistantSourceTag = "ADDED" | "MODIFIED" | "REMOVED" | "ATUAL";

type AssistantSource = {
	n: number;
	path: string;
	tag: AssistantSourceTag;
	requirement: string;
	text: string;
};

const sourceTags: Record<AssistantSourceTag, string> = {
	ADDED: "bg-primary/15 text-primary",
	MODIFIED: "bg-chart-3/15 text-chart-3",
	REMOVED: "bg-destructive/15 text-destructive",
	ATUAL: "bg-secondary text-foreground/85",
};

function AssistantConversationList({
	groups,
	activeId,
	onSelect,
	onNew,
	className,
}: {
	groups: AssistantConversationGroup[];
	activeId: string;
	onSelect: (id: string) => void;
	onNew: () => void;
	className?: string;
}) {
	return (
		<Card size="sm" className={cn("gap-3 px-3", className)}>
			<Button variant="outline" size="lg" onClick={onNew}>
				<Plus aria-hidden="true" />
				Nova conversa
			</Button>
			<nav aria-label="Conversas" className="flex flex-col gap-3">
				{groups.map((group) => (
					<div key={group.label} className="flex flex-col gap-0.5">
						<span className="px-2 py-1.5 text-muted-foreground text-xs">
							{group.label}
						</span>
						{group.conversations.map((conversation) => {
							const active = conversation.id === activeId;
							return (
								<Button
									key={conversation.id}
									variant="ghost"
									aria-current={active ? "page" : undefined}
									onClick={() => onSelect(conversation.id)}
									className={cn(
										"h-auto justify-start py-2 font-normal",
										active
											? "bg-muted text-foreground"
											: "text-muted-foreground",
									)}
								>
									<span className="truncate">{conversation.title}</span>
								</Button>
							);
						})}
					</div>
				))}
			</nav>
		</Card>
	);
}

function AssistantAvatar() {
	return (
		<span className="flex size-7 shrink-0 items-center justify-center rounded-lg border text-primary">
			<Sparkles className="size-3.5" aria-hidden="true" />
		</span>
	);
}

function AssistantStep({ label, done }: { label: string; done: boolean }) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"rounded-md bg-muted/40 font-mono font-normal",
				done ? "text-muted-foreground" : "text-foreground",
			)}
		>
			{done && <Check aria-hidden="true" />}
			{label}
			{!done && "…"}
		</Badge>
	);
}

function AssistantMessageView({ message }: { message: AssistantMessage }) {
	if (message.role === "user") {
		return (
			<div className="max-w-[78%] self-end rounded-2xl rounded-br-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed">
				{message.content}
			</div>
		);
	}

	if (message.pending && !message.content) {
		return (
			<div className="flex items-center gap-3" aria-live="polite">
				<AssistantAvatar />
				<div className="flex flex-wrap items-center gap-1.5">
					{message.steps.map((step) => (
						<AssistantStep key={step.label} {...step} />
					))}
					<span className="text-muted-foreground text-xs">Pensando…</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex max-w-[92%] gap-3">
			<AssistantAvatar />
			<div className="flex min-w-0 flex-col gap-2.5 text-foreground/85 text-sm leading-relaxed">
				{message.steps.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{message.steps.map((step) => (
							<AssistantStep key={step.label} {...step} />
						))}
					</div>
				)}
				{message.content}
				{message.citations && message.citations.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{message.citations.map((citation) => (
							<Badge
								key={citation.n}
								asChild
								className="rounded-md bg-primary/10 font-mono font-normal text-primary"
							>
								<a href={citation.href}>
									[{citation.n}] {citation.label}
								</a>
							</Badge>
						))}
					</div>
				)}
				<div className="flex gap-1 text-muted-foreground">
					<Button variant="outline" size="icon-sm" aria-label="Copiar resposta">
						<Copy aria-hidden="true" />
					</Button>
					<Button variant="outline" size="icon-sm" aria-label="Gerar novamente">
						<RotateCw aria-hidden="true" />
					</Button>
				</div>
			</div>
		</div>
	);
}

type AssistantChatProps = {
	title: string;
	context: string;
	messages: AssistantMessage[];
	draft: string;
	onDraftChange: (value: string) => void;
	onSend: () => void;
	onStop: () => void;
	/** Changes e specs citadas que vão como contexto da próxima pergunta. */
	contextChips: string[];
	agent: string;
	notesHref: string;
	className?: string;
};

function AssistantChat({
	title,
	context,
	messages,
	draft,
	onDraftChange,
	onSend,
	onStop,
	contextChips,
	agent,
	notesHref,
	className,
}: AssistantChatProps) {
	const busy = messages.some(
		(message) => message.role === "assistant" && message.pending,
	);

	return (
		<Card className={cn("gap-0 py-0", className)}>
			<CardHeader className="flex flex-wrap items-center justify-between gap-2.5 border-b py-3.5">
				<div className="flex flex-col gap-0.5">
					<CardTitle>
						<h1 className="font-semibold text-lg">{title}</h1>
					</CardTitle>
					<CardDescription className="text-xs">{context}</CardDescription>
				</div>
				<CardAction className="flex gap-1.5">
					<Button variant="outline" size="icon" aria-label="Copiar conversa">
						<Copy aria-hidden="true" />
					</Button>
					<Button variant="outline" asChild>
						<a href={notesHref}>
							<FileText aria-hidden="true" />
							Salvar em rascunhos
						</a>
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent
				role="log"
				aria-label="Mensagens"
				className="flex flex-1 flex-col gap-4.5 py-5"
			>
				{messages.map((message) => (
					<AssistantMessageView key={message.id} message={message} />
				))}
			</CardContent>

			<CardFooter className="flex-col items-stretch gap-2 border-t pt-3.5 pb-4">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						if (draft.trim()) onSend();
					}}
				>
					<InputGroup className="bg-card">
						<InputGroupTextarea
							rows={2}
							aria-label="Mensagem para o assistente"
							placeholder="Pergunte sobre as specs… use @ para citar uma change"
							value={draft}
							onChange={(event) => onDraftChange(event.target.value)}
							className="min-h-14"
						/>
						<InputGroupAddon align="block-end" className="flex-wrap gap-1.5">
							<InputGroupButton variant="outline" className="h-7 px-2.5">
								<Plus aria-hidden="true" />
								Contexto
							</InputGroupButton>
							{contextChips.map((chip) => (
								<Badge
									key={chip}
									variant="secondary"
									className="rounded-md font-mono font-normal"
								>
									{chip}
								</Badge>
							))}
							<span className="ml-auto text-muted-foreground text-xs">
								{agent}
							</span>
							{busy ? (
								<InputGroupButton
									type="button"
									size="icon-sm"
									aria-label="Parar resposta"
									onClick={onStop}
									className="bg-foreground text-background hover:bg-foreground/85"
								>
									<Square className="fill-current" aria-hidden="true" />
								</InputGroupButton>
							) : (
								<InputGroupButton
									type="submit"
									size="icon-sm"
									aria-label="Enviar"
									disabled={!draft.trim()}
									className="bg-foreground text-background hover:bg-foreground/85"
								>
									<ArrowUp aria-hidden="true" />
								</InputGroupButton>
							)}
						</InputGroupAddon>
					</InputGroup>
				</form>
				<p className="text-center text-muted-foreground text-xs">
					O assistente só lê arquivos e o histórico do git. Nada é alterado no
					repositório.
				</p>
			</CardFooter>
		</Card>
	);
}

function AssistantSources({
	sources,
	className,
}: {
	sources: AssistantSource[];
	className?: string;
}) {
	return (
		<Card size="sm" className={cn("gap-3", className)}>
			<CardHeader>
				<CardTitle>
					<h2 className="font-semibold text-sm">Fontes citadas</h2>
				</CardTitle>
				<CardAction className="font-mono text-muted-foreground text-xs">
					{sources.length}
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5">
				{sources.map((source) => (
					<article
						key={source.n}
						aria-label={`Fonte ${source.n}`}
						className="flex flex-col gap-2 rounded-lg border bg-background/40 p-3"
					>
						<div className="flex items-center gap-2 font-mono text-xs">
							<span className="text-primary">[{source.n}]</span>
							<span className="min-w-0 flex-1 truncate text-muted-foreground">
								{source.path}
							</span>
							<Badge
								className={cn(
									"rounded-sm px-1.5 font-bold font-sans text-[10px] tracking-wide",
									sourceTags[source.tag],
								)}
							>
								{source.tag}
							</Badge>
						</div>
						<span className="font-semibold text-sm">{source.requirement}</span>
						<span className="text-muted-foreground text-xs leading-relaxed">
							{source.text}
						</span>
					</article>
				))}
			</CardContent>
		</Card>
	);
}

export {
	AssistantChat,
	type AssistantChatProps,
	type AssistantCitation,
	type AssistantConversation,
	type AssistantConversationGroup,
	AssistantConversationList,
	type AssistantMessage,
	type AssistantSource,
	AssistantSources,
	type AssistantSourceTag,
};
