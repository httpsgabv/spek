import { ChangeReader } from "@spek/ui/components/change-reader";
import { FileHistoryPanel } from "@spek/ui/components/file-history-panel";
import {
	OpenspecTree,
	type OpenspecTreeNode,
} from "@spek/ui/components/openspec-tree";
import {
	type ReaderFontSize,
	ReaderHeader,
} from "@spek/ui/components/reader-header";
import { useMemo, useState } from "react";
import { arquivo, colunas } from "@/features/kanban/dados-exemplo";
import { conteudoDasChanges, specsDoRepositorio } from "./dados-exemplo";

const repositorio = { name: "kanban-board", initials: "KB" };

function montarArvore(changeId: string): OpenspecTreeNode[] {
	const changes = colunas.flatMap((coluna) => coluna.changes);
	return [
		{ label: "project.md" },
		{
			label: "specs",
			folder: true,
			count: specsDoRepositorio.length,
			children: specsDoRepositorio.map((spec) => ({
				label: spec.name,
				count: spec.requirements,
			})),
		},
		{
			label: "changes",
			folder: true,
			count: changes.length,
			children: changes.map((change) =>
				change.id === changeId
					? {
							label: change.id,
							children: [
								{ label: "proposal.md", current: true },
								{ label: "specs/" },
								{ label: "design.md" },
								{ label: "tasks.md" },
							],
						}
					: { label: change.id, href: `/leitura/${change.id}` },
			),
		},
		{ label: "archive", folder: true, muted: true, count: arquivo.total },
	];
}

/** Mantém só os nós cujo nome (ou de algum filho) contém o termo. */
function filtrarArvore(
	nodes: OpenspecTreeNode[],
	termo: string,
): OpenspecTreeNode[] {
	if (!termo) return nodes;
	return nodes.flatMap((node): OpenspecTreeNode[] => {
		const children = node.children ? filtrarArvore(node.children, termo) : [];
		if (children.length > 0) return [{ ...node, children }];
		return node.label.toLowerCase().includes(termo)
			? [{ ...node, children: undefined }]
			: [];
	});
}

export function Leitura({ changeId }: { changeId: string }) {
	const [busca, setBusca] = useState("");
	const [fonte, setFonte] = useState<ReaderFontSize>("md");
	const [autoria, setAutoria] = useState(true);

	const change = useMemo(
		() =>
			colunas
				.flatMap((coluna) => coluna.changes)
				.find((item) => item.id === changeId),
		[changeId],
	);
	const arvore = useMemo(
		() => filtrarArvore(montarArvore(changeId), busca.trim().toLowerCase()),
		[changeId, busca],
	);
	const conteudo = conteudoDasChanges[changeId];

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<ReaderHeader
				backHref="/kanban"
				repositoryInitials={repositorio.initials}
				path={[repositorio.name, "openspec", "changes", changeId]}
				search={busca}
				onSearchChange={setBusca}
				fontSize={fonte}
				onFontSizeChange={setFonte}
			/>

			<div className="flex flex-1 flex-col lg:flex-row">
				<OpenspecTree
					nodes={arvore}
					className="border-b lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0"
				/>

				<main className="flex min-w-0 flex-1 justify-center px-5 pt-10 pb-20 md:px-8 lg:pl-16">
					{change ? (
						<ChangeReader
							title={change.title}
							proposal={conteudo?.proposal ?? []}
							tasks={conteudo?.tasks}
							showBlame={autoria}
							fontSize={fonte}
						/>
					) : (
						<p className="text-muted-foreground text-sm">
							Change <span className="font-mono">{changeId}</span> não
							encontrada.
						</p>
					)}
				</main>

				{change && (
					<FileHistoryPanel
						fileName="proposal.md"
						showBlame={autoria}
						onShowBlameChange={setAutoria}
						contributors={conteudo?.historico.contributors ?? []}
						commits={conteudo?.historico.commits ?? []}
						branches={conteudo?.historico.branches ?? []}
						className="border-t lg:w-75 lg:shrink-0 lg:border-t-0 lg:border-l"
					/>
				)}
			</div>
		</div>
	);
}
