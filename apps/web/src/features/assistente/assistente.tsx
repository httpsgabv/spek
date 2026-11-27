import {
	AssistantChat,
	AssistantConversationList,
	type AssistantMessage,
	AssistantSources,
} from "@spek/ui/components/assistant-chat";
import { SidebarTrigger } from "@spek/ui/components/sidebar";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { fontes, grupos, mensagens } from "./dados-exemplo";

export function Assistente() {
	const [conversaAtiva, setConversaAtiva] = useState("conflitos-column");
	const [historico, setHistorico] = useState<AssistantMessage[]>(mensagens);
	const [rascunho, setRascunho] = useState("");

	const titulo =
		grupos
			.flatMap((grupo) => grupo.conversations)
			.find((conversa) => conversa.id === conversaAtiva)?.title ??
		"Nova conversa";

	return (
		<AppLayout activeHref="/assistente">
			<SidebarTrigger className="md:hidden" aria-label="Abrir menu" />
			<div className="flex flex-1 flex-wrap items-stretch gap-3">
				<AssistantConversationList
					groups={grupos}
					activeId={conversaAtiva}
					onSelect={setConversaAtiva}
					onNew={() => {
						setConversaAtiva("");
						setHistorico([]);
					}}
					className="min-w-0 flex-[1_1_15rem]"
				/>
				<AssistantChat
					title={titulo}
					context="Contexto: kanban-board · 9 changes · 6 specs · branch main"
					messages={historico}
					draft={rascunho}
					onDraftChange={setRascunho}
					onSend={() => {
						setHistorico((atual) => [
							...atual,
							{ id: `m${atual.length + 1}`, role: "user", content: rascunho },
						]);
						setRascunho("");
					}}
					onStop={() =>
						setHistorico((atual) =>
							atual.filter(
								(mensagem) =>
									!(mensagem.role === "assistant" && mensagem.pending),
							),
						)
					}
					contextChips={["@add-card-drag-drop", "specs/column"]}
					agent="Agente de specs"
					notesHref="/rascunhos"
					className="min-w-0 flex-[999_1_28.75rem]"
				/>
				<AssistantSources
					sources={fontes}
					className="min-w-0 flex-[1_1_17.5rem] self-start"
				/>
			</div>
		</AppLayout>
	);
}
