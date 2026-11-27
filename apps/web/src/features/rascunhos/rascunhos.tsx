import { Button } from "@spek/ui/components/button";
import {
	type Note,
	NoteEditor,
	type NoteFilter,
	NotesList,
} from "@spek/ui/components/notes-board";
import { PageHeader } from "@spek/ui/components/page-header";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { rascunhos } from "./dados-exemplo";

function comoProposal(nota: Note) {
	const tarefas = (nota.checklist ?? []).map(
		(item) => `- [${item.done ? "x" : " "}] ${item.label}`,
	);
	return [
		`## Why`,
		"",
		nota.body ?? nota.excerpt,
		"",
		...(tarefas.length ? ["## Tarefas", "", ...tarefas, ""] : []),
		...(nota.snippet ? [nota.snippet, ""] : []),
	].join("\n");
}

export function Rascunhos() {
	const [notas, setNotas] = useState(rascunhos);
	const [ativa, setAtiva] = useState(rascunhos[0]?.id ?? "");
	const [filtro, setFiltro] = useState<NoteFilter>("todos");
	const [busca, setBusca] = useState("");

	const nota = notas.find((item) => item.id === ativa) ?? notas[0];

	return (
		<AppLayout activeHref="/rascunhos">
			<PageHeader
				title="Rascunhos"
				description="Notas e ideias do projeto, salvas no app e fora do repositório"
			>
				<Button
					size="lg"
					className="bg-foreground px-3.5 font-semibold text-background hover:bg-foreground/85"
				>
					<Plus aria-hidden="true" />
					Novo rascunho
				</Button>
			</PageHeader>

			<div className="flex flex-1 flex-wrap items-stretch gap-3">
				<NotesList
					notes={notas}
					activeId={nota?.id ?? ""}
					onSelect={setAtiva}
					filter={filtro}
					onFilterChange={setFiltro}
					search={busca}
					onSearchChange={setBusca}
					className="min-w-0 flex-[1_1_18.75rem] self-start"
				/>
				{nota && (
					<NoteEditor
						note={nota}
						onToggleItem={(itemId) =>
							setNotas((atual) =>
								atual.map((item) =>
									item.id === nota.id
										? {
												...item,
												checklist: item.checklist?.map((tarefa) =>
													tarefa.id === itemId
														? { ...tarefa, done: !tarefa.done }
														: tarefa,
												),
											}
										: item,
								),
							)
						}
						onCopy={() => navigator.clipboard?.writeText(comoProposal(nota))}
						assistantHref="/assistente"
						className="min-w-0 flex-[999_1_30rem]"
					/>
				)}
			</div>
		</AppLayout>
	);
}
