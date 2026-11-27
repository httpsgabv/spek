import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import { Progress } from "@spek/ui/components/progress";

type Contributor = { initials: string; name: string; commits: number };

function ContributorsCard({
	contributors,
	description,
}: {
	contributors: Contributor[];
	description?: string;
}) {
	const max = Math.max(1, ...contributors.map((person) => person.commits));

	return (
		<Card size="sm" className="gap-3">
			<CardHeader>
				<CardTitle>Contribuidores</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-3">
					{contributors.map((person) => (
						<li
							key={person.name}
							className="flex items-center gap-2.5 text-[13px]"
						>
							<Avatar size="sm">
								<AvatarFallback className="bg-secondary font-semibold text-[9px] text-foreground">
									{person.initials}
								</AvatarFallback>
							</Avatar>
							<span className="w-23 shrink-0">{person.name}</span>
							<Progress
								value={(person.commits / max) * 100}
								aria-label={`Commits de ${person.name}`}
								className="h-2 flex-1 bg-accent *:data-[slot=progress-indicator]:bg-ring"
							/>
							<span className="w-6 text-right font-mono text-xs">
								{person.commits}
							</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

export { type Contributor, ContributorsCard };
