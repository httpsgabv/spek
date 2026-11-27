import { PageHeader } from "@spek/ui/components/page-header";
import {
	AssistantSettings,
	GitSettings,
	RepositoriesSettings,
	SettingsNav,
	type SettingsSection,
} from "@spek/ui/components/settings-panels";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
	assistenteInicial,
	caminhoChecado,
	executavelGit,
	gitInicial,
	provedores,
	repositoriosConfigurados,
} from "./dados-exemplo";

const secoes: SettingsSection[] = [
	{ id: "repos", label: "Repositórios" },
	{ id: "git", label: "Git" },
	{ id: "ia", label: "Assistente IA" },
];

function iniciais(nome: string) {
	return nome
		.split(/[-_\s]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((parte) => parte[0]?.toUpperCase())
		.join("");
}

export function Configuracoes() {
	const [secao, setSecao] = useState("repos");
	const [repositorios, setRepositorios] = useState(repositoriosConfigurados);
	const [caminho, setCaminho] = useState(caminhoChecado.path);
	const [git, setGit] = useState(gitInicial);
	const [assistente, setAssistente] = useState(assistenteInicial);

	return (
		<AppLayout activeHref="/configuracoes">
			<PageHeader
				title="Configurações"
				description="Repositórios locais, git e assistente. Tudo fica salvo neste computador."
			/>
			<SettingsNav
				sections={secoes}
				value={secao}
				onValueChange={(id) => {
					setSecao(id);
					document
						.getElementById(id)
						?.scrollIntoView?.({ behavior: "smooth", block: "start" });
				}}
			/>

			<RepositoriesSettings
				repositories={repositorios}
				path={caminho}
				onPathChange={setCaminho}
				pathCheck={
					caminho === caminhoChecado.path ? caminhoChecado.check : undefined
				}
				onBrowse={() => {}}
				onAdd={() => {
					const path = caminho.trim();
					if (repositorios.some((repo) => repo.path === path)) return;
					const name = path.split(/[\\/]/).filter(Boolean).pop() ?? path;
					setRepositorios((atual) => [
						...atual,
						{
							name,
							path,
							initials: iniciais(name),
							status: "lendo openspec/…",
							baseBranch: "main",
							readAt: "agora",
						},
					]);
					setCaminho("");
				}}
				onReload={() => {}}
				onRemove={(path) =>
					setRepositorios((atual) => atual.filter((repo) => repo.path !== path))
				}
			/>

			<div className="flex flex-wrap items-start gap-3">
				<GitSettings
					executable={executavelGit}
					value={git}
					onChange={setGit}
					className="min-w-0 flex-[1_1_23.75rem]"
				/>
				<AssistantSettings
					providers={provedores}
					value={assistente}
					onChange={setAssistente}
					className="min-w-0 flex-[1_1_23.75rem]"
				/>
			</div>
		</AppLayout>
	);
}
