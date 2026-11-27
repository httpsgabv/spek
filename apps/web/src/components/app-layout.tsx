import {
	AppSidebar,
	type AppSidebarItem,
	type AppSidebarRepository,
} from "@spek/ui/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@spek/ui/components/sidebar";
import {
	BookOpen,
	FileText,
	GitBranch,
	LayoutDashboard,
	SlidersHorizontal,
	Sparkles,
	SquareKanban,
} from "lucide-react";
import type { ReactNode } from "react";

const itensMenu: AppSidebarItem[] = [
	{ title: "Dashboard", href: "/", icon: LayoutDashboard },
	{ title: "Kanban", href: "/kanban", icon: SquareKanban, badge: 9 },
	{ title: "Specs", href: "/specs", icon: BookOpen },
	{ title: "Atividade", href: "/atividade", icon: GitBranch },
	{ title: "Assistente IA", href: "/assistente", icon: Sparkles },
	{ title: "Rascunhos", href: "/rascunhos", icon: FileText, badge: 6 },
];

const itemConfiguracoes: AppSidebarItem = {
	title: "Configurações",
	href: "/configuracoes",
	icon: SlidersHorizontal,
};

// Dados fictícios até existir endpoint no contrato para repositórios.
const repositorioAtual: AppSidebarRepository = {
	name: "kanban-board",
	path: "~/dev/kanban-board",
	initials: "KB",
	summary: "9 changes ativas",
};

const repositorios: AppSidebarRepository[] = [
	repositorioAtual,
	{
		name: "api-pedidos",
		path: "~/dev/api-pedidos",
		initials: "AP",
		summary: "4 changes ativas",
	},
	{
		name: "app-mobile",
		path: "~/dev/app-mobile",
		initials: "AM",
		summary: "2 changes ativas",
	},
	{
		name: "design-system",
		path: "~/dev/design-system",
		initials: "DS",
		summary: "openspec/ não encontrado",
		warning: true,
	},
];

export function AppLayout({
	activeHref,
	children,
}: {
	activeHref: string;
	children: ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar
				items={itensMenu}
				footerItem={itemConfiguracoes}
				activeHref={activeHref}
				repository={repositorioAtual}
				repositories={repositorios}
				addRepositoryHref="/configuracoes"
			/>
			<SidebarInset className="min-w-0 gap-3 p-3 md:pl-1">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
