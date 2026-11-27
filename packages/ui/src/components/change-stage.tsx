import { cn } from "@spek/ui/lib/utils";
import type * as React from "react";

type ChangeStage = "proposta" | "design" | "andamento" | "concluida";

const changeStages: Record<
	ChangeStage,
	{ label: string; text: string; bg: string; indicator: string }
> = {
	proposta: {
		label: "Proposta",
		text: "text-chart-1",
		bg: "bg-chart-1",
		indicator: "*:data-[slot=progress-indicator]:bg-chart-1",
	},
	design: {
		label: "Design",
		text: "text-chart-2",
		bg: "bg-chart-2",
		indicator: "*:data-[slot=progress-indicator]:bg-chart-2",
	},
	andamento: {
		label: "Em andamento",
		text: "text-chart-3",
		bg: "bg-chart-3",
		indicator: "*:data-[slot=progress-indicator]:bg-chart-3",
	},
	concluida: {
		label: "Concluída",
		text: "text-chart-4",
		bg: "bg-chart-4",
		indicator: "*:data-[slot=progress-indicator]:bg-chart-4",
	},
};

function ChangeStageDot({
	stage,
	className,
	...props
}: React.ComponentProps<"span"> & { stage: ChangeStage }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"size-1.5 shrink-0 rounded-full",
				changeStages[stage].bg,
				className,
			)}
			{...props}
		/>
	);
}

function ChangeStageLabel({
	stage,
	className,
	...props
}: React.ComponentProps<"span"> & { stage: ChangeStage }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 text-xs",
				changeStages[stage].text,
				className,
			)}
			{...props}
		>
			<ChangeStageDot stage={stage} />
			{changeStages[stage].label}
		</span>
	);
}

export { type ChangeStage, ChangeStageDot, ChangeStageLabel, changeStages };
