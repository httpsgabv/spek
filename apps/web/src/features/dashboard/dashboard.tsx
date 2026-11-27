import { ChangesByStageCard } from "@spek/ui/components/changes-by-stage-card";
import { ChangesProgressCard } from "@spek/ui/components/changes-progress-card";
import { DashboardHeader } from "@spek/ui/components/dashboard-header";
import { RecentActivityCard } from "@spek/ui/components/recent-activity-card";
import { StatCard } from "@spek/ui/components/stat-card";
import { WeeklyTasksChart } from "@spek/ui/components/weekly-tasks-chart";
import { AppLayout } from "@/components/app-layout";
import {
	atividades,
	capabilities,
	changes,
	estagios,
	indicadores,
	tasksPorSemana,
} from "./dados-exemplo";

export function Dashboard() {
	return (
		<AppLayout activeHref="/">
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
		</AppLayout>
	);
}
