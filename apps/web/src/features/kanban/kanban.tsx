import { ChangeFilesLegend } from "@spek/ui/components/change-files";
import {
	type ChangeProgress,
	ChangesProgressCard,
} from "@spek/ui/components/changes-progress-card";
import {
	KanbanBoard,
	type KanbanColumn,
} from "@spek/ui/components/kanban-board";
import {
	type KanbanView,
	KanbanToolbar,
	KanbanViewToggle,
} from "@spek/ui/components/kanban-toolbar";
import { PageHeader } from "@spek/ui/components/page-header";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { arquivo, autores, colunas } from "./dados-exemplo";

type Filtros = {
	busca: string;
	capability: string | null;
	autor: string | null;
};

function filtrarColunas(
	colunas: KanbanColumn[],
	{ busca, capability, autor }: Filtros,
): KanbanColumn[] {
	const termo = busca.trim().toLowerCase();
	return colunas.map((coluna) => ({
		...coluna,
		changes: coluna.changes.filter(
			(change) =>
				(!capability || change.capabilities.includes(capability)) &&
				(!autor || change.author === autor) &&
				(!termo ||
					[change.id, change.title, ...change.capabilities].some((texto) =>
						texto.toLowerCase().includes(termo),
					)),
		),
	}));
}

function capabilitiesPorUso(colunas: KanbanColumn[]): string[] {
	const contagem = new Map<string, number>();
	for (const coluna of colunas) {
		for (const change of coluna.changes) {
			for (const capability of change.capabilities) {
				contagem.set(capability, (contagem.get(capability) ?? 0) + 1);
			}
		}
	}
	return [...contagem.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([capability]) => capability);
}

function paraLista(colunas: KanbanColumn[]): ChangeProgress[] {
	return colunas.flatMap((coluna) =>
		coluna.changes.map((change) => ({
			id: change.id,
			stage: coluna.stage,
			tasksDone: change.tasks?.done ?? 0,
			tasksTotal: change.tasks?.total ?? 0,
			author: change.author,
			updatedAt: change.updatedAt,
		})),
	);
}

export function Kanban() {
	const [visao, setVisao] = useState<KanbanView>("quadro");
	const [busca, setBusca] = useState("");
	const [capability, setCapability] = useState<string | null>(null);
	const [autor, setAutor] = useState<string | null>(null);

	const capabilities = useMemo(() => capabilitiesPorUso(colunas), []);
	const filtradas = useMemo(
		() => filtrarColunas(colunas, { busca, capability, autor }),
		[busca, capability, autor],
	);

	return (
		<AppLayout activeHref="/kanban">
			<PageHeader
				title="Kanban"
				description={
					<>
						Estágio calculado a partir dos arquivos e do progresso em{" "}
						<span className="font-mono">tasks.md</span>
					</>
				}
			>
				<KanbanViewToggle value={visao} onValueChange={setVisao} />
			</PageHeader>

			<KanbanToolbar
				search={busca}
				onSearchChange={setBusca}
				capabilities={capabilities}
				capability={capability}
				onCapabilityChange={setCapability}
				authors={autores}
				author={autor}
				onAuthorChange={setAutor}
			/>

			{visao === "quadro" ? (
				<KanbanBoard columns={filtradas} archive={arquivo} />
			) : (
				<ChangesProgressCard changes={paraLista(filtradas)} />
			)}

			<ChangeFilesLegend className="px-1.5" />
		</AppLayout>
	);
}
