import { SidebarTrigger } from "@spek/ui/components/sidebar";
import type * as React from "react";

type PageHeaderProps = {
	title: string;
	description?: React.ReactNode;
	children?: React.ReactNode;
};

function PageHeader({ title, description, children }: PageHeaderProps) {
	return (
		<header className="flex flex-wrap items-end justify-between gap-3 px-1.5 pt-3.5 pb-1">
			<div className="flex items-start gap-2">
				<SidebarTrigger className="mt-1 md:hidden" aria-label="Abrir menu" />
				<div className="flex flex-col gap-1">
					<h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
					{description && (
						<p className="text-muted-foreground text-sm">{description}</p>
					)}
				</div>
			</div>
			{children && <div className="flex flex-wrap gap-2">{children}</div>}
		</header>
	);
}

export { PageHeader, type PageHeaderProps };
