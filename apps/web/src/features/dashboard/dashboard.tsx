import {
	AppSidebar,
	type AppSidebarItem,
} from "@spek/ui/components/app-sidebar";
import { ChangesByStageCard } from "@spek/ui/components/changes-by-stage-card";
import { ChangesProgressCard } from "@spek/ui/components/changes-progress-card";
import { DashboardHeader } from "@spek/ui/components/dashboard-header";
import { RecentActivityCard } from "@spek/ui/components/recent-activity-card";
import { SidebarInset, SidebarProvider } from "@spek/ui/components/sidebar";
import { StatCard } from "@spek/ui/components/stat-card";
import { WeeklyTasksChart } from "@spek/ui/components/weekly-tasks-chart";
import {
	BookOpen,
	FileText,
	GitBranch,
	LayoutDashboard,
	SlidersHorizontal,
	Sparkles,
	SquareKanban,
} from "lucide-react";
import {
	atividades,
	capabilities,
	changes,
	estagios,
	indicadores,
	repositorioAtual,
	repositorios,
	tasksPorSemana,
} from "./dados-exemplo";

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

export function Dashboard() {
	return (
		<SidebarProvider>
			<AppSidebar
				items={itensMenu}
				footerItem={itemConfiguracoes}
				activeHref="/"
				repository={repositorioAtual}
				repositories={repositorios}
				addRepositoryHref="/configuracoes"
			/>
			<SidebarInset className="gap-3 p-3 md:pl-1">
				<DashboardHeader
					openspecPath="kanban-board/openspec"
					branch="main"
					period="Últimos 30 dias"
					readAgo="Lido há 1 min"
				/>

				<section
					aria-label="Indicadores"
					className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3"
				>
					{indicadores.map((indicador) => (
						<StatCard key={indicador.label} {...indicador} />
					))}
				</section>

				<section className="grid gap-3 xl:grid-cols-[2fr_1fr]">
					<WeeklyTasksChart data={tasksPorSemana} />
					<ChangesByStageCard stages={estagios} capabilities={capabilities} />
				</section>

				<section className="grid gap-3 xl:grid-cols-[2fr_1fr]">
					<ChangesProgressCard changes={changes} kanbanHref="/kanban" />
					<RecentActivityCard items={atividades} allHref="/atividade" />
				</section>
			</SidebarInset>
		</SidebarProvider>
	);
}
