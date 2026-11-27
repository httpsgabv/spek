import { Avatar, AvatarFallback } from "@spek/ui/components/avatar";
import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";

type ActivityItem = {
	hash: string;
	author: string;
	message: string;
	path: string;
	when: string;
};

type RecentActivityCardProps = {
	items: ActivityItem[];
	allHref: string;
};

function RecentActivityCard({ items, allHref }: RecentActivityCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Atividade recente</CardTitle>
				<CardAction>
					<Button variant="link" size="sm" className="h-auto p-0" asChild>
						<a href={allHref}>Ver tudo →</a>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col">
					{items.map((item) => (
						<li
							key={item.hash}
							className="flex gap-2.5 border-b py-2.5 last:border-b-0"
						>
							<Avatar size="sm">
								<AvatarFallback className="font-semibold text-[10px] text-foreground">
									{item.author}
								</AvatarFallback>
							</Avatar>
							<div className="flex min-w-0 flex-col gap-0.5">
								<span className="leading-snug">{item.message}</span>
								<span className="truncate font-mono text-muted-foreground text-xs">
									{item.hash} · {item.path}
								</span>
							</div>
							<span className="ml-auto shrink-0 text-muted-foreground text-xs">
								{item.when}
							</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

export { type ActivityItem, RecentActivityCard, type RecentActivityCardProps };
