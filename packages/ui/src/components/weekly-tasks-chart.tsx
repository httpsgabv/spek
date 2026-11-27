import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@spek/ui/components/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

type WeeklyTasksChartProps = {
	data: { week: string; tasks: number }[];
};

const chartConfig = {
	tasks: { label: "Tasks", color: "var(--chart-5)" },
} satisfies ChartConfig;

function WeeklyTasksChart({ data }: WeeklyTasksChartProps) {
	const total = data.reduce((sum, item) => sum + item.tasks, 0);
	const average = data.length ? total / data.length : 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tasks concluídas por semana</CardTitle>
				<CardDescription className="text-xs">
					Checkboxes marcados em <code className="font-mono">tasks.md</code>,
					todas as changes
				</CardDescription>
				<CardAction className="flex gap-5">
					<Metric label={`${data.length} semanas`} value={String(total)} />
					<Metric
						label="Média/semana"
						value={average.toLocaleString("pt-BR", {
							maximumFractionDigits: 1,
						})}
					/>
				</CardAction>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-60 w-full"
				>
					<BarChart data={data} margin={{ left: -20, right: 0, top: 8 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="week"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							className="font-mono"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							className="font-mono"
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(week) => `Semana de ${week}`}
								/>
							}
						/>
						<Bar dataKey="tasks" radius={[6, 6, 2, 2]} maxBarSize={34}>
							{data.map((item, index) => (
								<Cell
									key={item.week}
									fill={
										index === data.length - 1
											? "var(--color-primary)"
											: "var(--color-tasks)"
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col items-end gap-0.5">
			<span className="text-muted-foreground text-xs">{label}</span>
			<span className="font-medium font-mono text-xl">{value}</span>
		</div>
	);
}

export { WeeklyTasksChart, type WeeklyTasksChartProps };
