import { Badge } from "@spek/ui/components/badge";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@spek/ui/components/card";
import { Checkbox } from "@spek/ui/components/checkbox";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@spek/ui/components/input-group";
import { Label } from "@spek/ui/components/label";
import { Separator } from "@spek/ui/components/separator";
import { ToggleGroup, ToggleGroupItem } from "@spek/ui/components/toggle-group";
import { cn } from "@spek/ui/lib/utils";
import {
	Bold,
	Check,
	Code,
	Copy,
	Italic,
	ListChecks,
	Search,
	Sparkles,
} from "lucide-react";

type NoteKind = "ideia" | "nota" | "duvida";

/** Filtro da lista: um tipo ou todos. */
type NoteFilter = NoteKind | "todos";

type NoteChecklistItem = { id: string; label: string; done: boolean };

type Note = {
	id: string;
	kind: NoteKind;
	title: string;
	excerpt: string;
	/** Changes do OpenSpec citadas na nota. */
	changes: string[];
	/** Quando foi editada, já formatado (ex.: `3 min`, `ontem`). */
	updated: string;
	body?: string;
	checklist?: NoteChecklistItem[];
	/** Trecho em markdown, como um cenário de spec. */
	snippet?: string;
};

const kinds: Record<
	NoteKind,
	{ label: string; plural: string; className: string }
> = {
	ideia: {
		label: "Ideia",
		plural: "Ideias",
		className: "bg-primary/15 text-primary",
	},
	nota: {
		label: "Nota",
		plural: "Notas",
		className: "bg-secondary text-foreground/85",
	},
	duvida: {
		label: "Dúvida",
		plural: "Dúvidas",
		className: "bg-warning/15 text-warning",
	},
};

function NoteKindBadge({
	kind,
	className,
}: {
	kind: NoteKind;
	className?: string;
}) {
	return (
		<Badge
			className={cn("rounded-md font-medium", kinds[kind].className, className)}
		>
			{kinds[kind].label}
		</Badge>
	);
}

function matchesNote(note: Note, filter: NoteFilter, search: string) {
	const term = search.trim().toLowerCase();
	return (
		(filter === "todos" || note.kind === filter) &&
		(!term ||
			[note.title, note.excerpt, ...note.changes].some((text) =>
				text.toLowerCase().includes(term),
			))
	);
}

type NotesListProps = {
	notes: Note[];
	activeId: string;
	onSelect: (id: string) => void;
	filter: NoteFilter;
	onFilterChange: (filter: NoteFilter) => void;
	search: string;
	onSearchChange: (search: string) => void;
	className?: string;
};

function NotesList({
	notes,
	activeId,
	onSelect,
	filter,
	onFilterChange,
	search,
	onSearchChange,
	className,
}: NotesListProps) {
	const visible = notes.filter((note) => matchesNote(note, filter, search));
	const count = (kind: NoteKind) =>
		notes.filter((note) => note.kind === kind).length;
	const chip =
		"rounded-full px-2.5 text-xs data-[state=on]:bg-foreground data-[state=on]:font-semibold data-[state=on]:text-background";

	return (
		<Card size="sm" className={cn("gap-2.5 px-3", className)}>
			<InputGroup className="h-9 bg-background/40">
				<InputGroupAddon>
					<Search aria-hidden="true" />
				</InputGroupAddon>
				<InputGroupInput
					type="search"
					aria-label="Buscar rascunhos"
					placeholder="Buscar rascunhos"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
				/>
			</InputGroup>

			<ToggleGroup
				type="single"
				size="sm"
				variant="outline"
				aria-label="Tipo"
				value={filter}
				onValueChange={(next) => {
					if (next) onFilterChange(next as NoteFilter);
				}}
				className="flex-wrap"
			>
				<ToggleGroupItem value="todos" className={chip}>
					Todos {notes.length}
				</ToggleGroupItem>
				{(Object.keys(kinds) as NoteKind[]).map((kind) => (
					<ToggleGroupItem key={kind} value={kind} className={chip}>
						{kinds[kind].plural} {count(kind)}
					</ToggleGroupItem>
				))}
			</ToggleGroup>

			<ul aria-label="Rascunhos" className="flex flex-col gap-2">
				{visible.map((note) => {
					const active = note.id === activeId;
					return (
						<li key={note.id}>
							<Button
								variant="outline"
								aria-current={active ? "true" : undefined}
								onClick={() => onSelect(note.id)}
								className={cn(
									"h-auto w-full flex-col items-stretch gap-1.5 whitespace-normal p-3 text-left font-normal",
									active
										? "border-ring/60 bg-muted/60 dark:bg-muted/60"
										: "bg-transparent dark:bg-transparent",
								)}
							>
								<span className="flex items-center gap-2">
									<NoteKindBadge kind={note.kind} />
									<span className="ml-auto text-muted-foreground text-xs">
										{note.updated}
									</span>
								</span>
								<span className="font-medium text-sm">{note.title}</span>
								<span className="text-muted-foreground text-xs leading-snug">
									{note.excerpt}
								</span>
								{note.changes[0] && (
									<span className="font-mono text-foreground/85 text-xs">
										↳ {note.changes[0]}
									</span>
								)}
							</Button>
						</li>
					);
				})}
			</ul>
			{visible.length === 0 && (
				<p className="px-1 py-6 text-center text-muted-foreground text-sm">
					Nenhum rascunho com esses filtros.
				</p>
			)}
		</Card>
	);
}

const keywords: Record<string, string> = {
	WHEN: "text-chart-3",
	THEN: "text-primary",
	AND: "text-muted-foreground",
};

function NoteSnippet({ snippet }: { snippet: string }) {
	return (
		<pre className="overflow-x-auto rounded-lg border bg-background/60 px-4 py-3.5 font-mono text-foreground/85 text-sm leading-loose">
			{snippet.split("\n").map((line, index) => {
				const match = line.match(/^(- )(WHEN|THEN|AND)(\b.*)$/);
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: linhas fixas do trecho
					<span key={index} className="block">
						{match ? (
							<>
								{match[1]}
								<span className={keywords[match[2] ?? ""]}>{match[2]}</span>
								{match[3]}
							</>
						) : (
							line
						)}
					</span>
				);
			})}
		</pre>
	);
}

type NoteEditorProps = {
	note: Note;
	onToggleItem: (itemId: string) => void;
	onCopy: () => void;
	assistantHref: string;
	className?: string;
};

function NoteEditor({
	note,
	onToggleItem,
	onCopy,
	assistantHref,
	className,
}: NoteEditorProps) {
	return (
		<Card className={cn("gap-0 py-0", className)}>
			<CardHeader className="flex flex-wrap items-center gap-2 border-b py-3">
				<ToggleGroup type="multiple" size="sm" aria-label="Formatação">
					<ToggleGroupItem value="negrito" aria-label="Negrito">
						<Bold aria-hidden="true" />
					</ToggleGroupItem>
					<ToggleGroupItem value="italico" aria-label="Itálico">
						<Italic aria-hidden="true" />
					</ToggleGroupItem>
					<ToggleGroupItem value="lista" aria-label="Lista de verificação">
						<ListChecks aria-hidden="true" />
					</ToggleGroupItem>
					<ToggleGroupItem value="codigo" aria-label="Código">
						<Code aria-hidden="true" />
					</ToggleGroupItem>
					<ToggleGroupItem
						value="citar"
						aria-label="Citar change"
						className="font-mono"
					>
						@
					</ToggleGroupItem>
				</ToggleGroup>
				<div className="ml-auto flex flex-wrap gap-1.5">
					<Button variant="outline" asChild>
						<a href={assistantHref}>
							<Sparkles aria-hidden="true" />
							Discutir com a IA
						</a>
					</Button>
					<Button variant="outline" onClick={onCopy}>
						<Copy aria-hidden="true" />
						Copiar como proposal.md
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex max-w-3xl flex-1 flex-col gap-4 px-8 py-7">
				<div className="flex flex-wrap items-center gap-2">
					<NoteKindBadge kind={note.kind} />
					{note.changes.map((change) => (
						<Badge
							key={change}
							variant="outline"
							className="rounded-md bg-muted/40 font-normal text-foreground/85"
						>
							Vinculado a <span className="font-mono">{change}</span>
						</Badge>
					))}
				</div>
				<h2 className="font-semibold text-3xl tracking-tight">{note.title}</h2>
				{note.body && (
					<p className="text-base text-foreground/85 leading-relaxed">
						{note.body}
					</p>
				)}
				{note.checklist && note.checklist.length > 0 && (
					<ul aria-label="Checklist" className="flex flex-col gap-2">
						{note.checklist.map((item) => (
							<li key={item.id} className="flex items-start gap-2.5">
								<Checkbox
									id={`item-${item.id}`}
									checked={item.done}
									onCheckedChange={() => onToggleItem(item.id)}
									className="mt-1"
								/>
								<Label
									htmlFor={`item-${item.id}`}
									className={cn(
										"font-normal text-base leading-relaxed",
										item.done
											? "text-muted-foreground line-through"
											: "text-foreground/85",
									)}
								>
									{item.label}
								</Label>
							</li>
						))}
					</ul>
				)}
				{note.snippet && <NoteSnippet snippet={note.snippet} />}
			</CardContent>

			<Separator />
			<CardFooter className="flex-wrap justify-between gap-2.5 bg-transparent py-3 text-muted-foreground text-xs">
				<span className="flex items-center gap-1.5">
					<Check className="size-3 text-primary" aria-hidden="true" />
					Salvo neste computador, fora do repositório
				</span>
				<span>Última edição: {note.updated}</span>
			</CardFooter>
		</Card>
	);
}

export {
	type Note,
	type NoteChecklistItem,
	NoteEditor,
	type NoteEditorProps,
	type NoteFilter,
	type NoteKind,
	NoteKindBadge,
	NotesList,
	type NotesListProps,
};
