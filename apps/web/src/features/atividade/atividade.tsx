import { ActiveBranchesCard } from "@spek/ui/components/active-branches-card";
import { ContributorsCard } from "@spek/ui/components/contributors-card";
import {
	GitActivityFeed,
	type GitActivityFilter,
	GitActivityFilters,
} from "@spek/ui/components/git-activity-feed";
import { PageHeader } from "@spek/ui/components/page-header";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { branchesAtivas, contribuidores, dias } from "./dados-exemplo";

export function Atividade() {
	const [filtro, setFiltro] = useState<GitActivityFilter>("tudo");
	const [branch, setBranch] = useState<string | null>(null);

	const branches = useMemo(
		() => [
			...new Set(
				dias.flatMap((dia) => dia.commits.map((commit) => commit.branch)),
			),
		],
		[],
	);

	return (
		<AppLayout activeHref="/atividade">
			<PageHeader
				title="Atividade"
				description={
					<>
						Commits que tocam{" "}
						<span className="font-mono text-foreground">openspec/</span> ou
						citam uma change, em todas as branches locais
					</>
				}
			>
				<GitActivityFilters
					filter={filtro}
					onFilterChange={setFiltro}
					branches={branches}
					branch={branch}
					onBranchChange={setBranch}
				/>
			</PageHeader>

			<div className="flex flex-wrap items-start gap-3">
				<GitActivityFeed
					days={dias}
					filter={filtro}
					branch={branch}
					className="min-w-0 flex-[2_1_35rem]"
				/>
				<div className="flex min-w-0 flex-[1_1_18.75rem] flex-col gap-3">
					<ActiveBranchesCard branches={branchesAtivas} />
					<ContributorsCard
						contributors={contribuidores}
						description="Commits em openspec/ · últimos 30 dias"
					/>
				</div>
			</div>
		</AppLayout>
	);
}
