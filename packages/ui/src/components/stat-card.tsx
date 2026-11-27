import { Badge } from "@spek/ui/components/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
} from "@spek/ui/components/card";
import { Progress } from "@spek/ui/components/progress";
import { cn } from "@spek/ui/lib/utils";
import type * as React from "react";

type StatCardProps = {
	label: string;
	value: number;
	total?: number;
	trend: { label: string; tone: "success" | "warning" };
	progress?: number;
	description?: React.ReactNode;
};

function StatCard({
	label,
	value,
	total,
	trend,
	progress,
	description,
}: StatCardProps) {
	return (
		<Card className="gap-2.5">
			<CardHeader>
				<CardDescription>{label}</CardDescription>
				<CardAction>
					<Badge
						className={cn(
							"rounded-md font-semibold",
							trend.tone === "success"
								? "bg-primary/15 text-primary"
								: "bg-warning/15 text-warning",
						)}
					>
						{trend.label}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5">
				<p className="font-medium font-mono text-3xl tracking-tight">
					{value}
					{total !== undefined && (
						<span className="text-muted-foreground/70 text-xl">/{total}</span>
					)}
				</p>
				{progress !== undefined && (
					<Progress value={progress} className="h-1.5" aria-label={label} />
				)}
				{description && (
					<p className="text-muted-foreground text-xs">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}

export { StatCard, type StatCardProps };
