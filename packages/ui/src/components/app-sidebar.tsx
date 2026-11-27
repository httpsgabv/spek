import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@spek/ui/components/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@spek/ui/components/sidebar";
import { cn } from "@spek/ui/lib/utils";
import {
	Braces,
	Check,
	ChevronsUpDown,
	Lock,
	type LucideIcon,
	Plus,
} from "lucide-react";

type AppSidebarItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	badge?: number;
};

type AppSidebarRepository = {
	name: string;
	path: string;
	initials: string;
	summary: string;
	warning?: boolean;
};

type AppSidebarProps = {
	items: AppSidebarItem[];
	footerItem: AppSidebarItem;
	activeHref: string;
	repository: AppSidebarRepository;
	repositories: AppSidebarRepository[];
	addRepositoryHref: string;
};

function AppSidebar({
	items,
	footerItem,
	activeHref,
	repository,
	repositories,
	addRepositoryHref,
}: AppSidebarProps) {
	return (
		<Sidebar variant="floating">
			<SidebarHeader className="gap-4">
				<div className="flex items-center justify-between gap-2 px-1">
					<div className="flex items-center gap-2.5">
						<span className="flex size-7 items-center justify-center rounded-md border text-primary">
							<Braces className="size-4" aria-hidden="true" />
						</span>
						<span className="font-semibold text-foreground tracking-tight">
							Specboard
						</span>
					</div>
					<SidebarTrigger aria-label="Recolher menu" />
				</div>
				<SidebarGroup className="p-0">
					<SidebarGroupLabel className="uppercase tracking-wider">
						Repositório
					</SidebarGroupLabel>
					<RepositorySwitcher
						repository={repository}
						repositories={repositories}
						addRepositoryHref={addRepositoryHref}
					/>
				</SidebarGroup>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<nav aria-label="Principal">
							<SidebarMenu>
								{items.map((item) => (
									<NavItem
										key={item.href}
										item={item}
										active={item.href === activeHref}
									/>
								))}
							</SidebarMenu>
						</nav>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<p className="flex items-center gap-2 rounded-lg border border-dashed p-2.5 text-muted-foreground text-xs leading-snug">
					<Lock className="size-3.5 shrink-0" aria-hidden="true" />
					Somente leitura · nada é gravado no repositório
				</p>
				<SidebarMenu>
					<NavItem item={footerItem} active={footerItem.href === activeHref} />
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

function NavItem({ item, active }: { item: AppSidebarItem; active: boolean }) {
	const Icon = item.icon;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={active}>
				<a href={item.href} aria-current={active ? "page" : undefined}>
					<Icon aria-hidden="true" />
					<span>{item.title}</span>
				</a>
			</SidebarMenuButton>
			{item.badge !== undefined && (
				<SidebarMenuBadge className="font-mono">{item.badge}</SidebarMenuBadge>
			)}
		</SidebarMenuItem>
	);
}

function RepositoryAvatar({
	repository,
	className,
}: {
	repository: AppSidebarRepository;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex shrink-0 items-center justify-center rounded-md font-bold",
				repository.warning
					? "bg-muted text-foreground"
					: "bg-primary text-primary-foreground",
				className,
			)}
		>
			{repository.initials}
		</span>
	);
}

function RepositorySwitcher({
	repository,
	repositories,
	addRepositoryHref,
}: {
	repository: AppSidebarRepository;
	repositories: AppSidebarRepository[];
	addRepositoryHref: string;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="border bg-card data-[state=open]:bg-sidebar-accent"
				>
					<RepositoryAvatar
						repository={repository}
						className="size-8 text-xs"
					/>
					<span className="grid min-w-0 flex-1 text-left leading-tight">
						<span className="truncate font-semibold text-foreground">
							{repository.name}
						</span>
						<span className="truncate font-mono text-muted-foreground text-xs">
							{repository.path}
						</span>
					</span>
					<ChevronsUpDown className="ml-auto" aria-hidden="true" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
			>
				<DropdownMenuLabel className="text-muted-foreground text-xs">
					{repositories.length} repositórios
				</DropdownMenuLabel>
				{repositories.map((item) => (
					<DropdownMenuItem key={item.path} className="gap-2">
						<RepositoryAvatar
							repository={item}
							className="size-6 text-[10px]"
						/>
						<span className="grid min-w-0 flex-1 leading-tight">
							<span className="truncate font-semibold text-xs">
								{item.name}
							</span>
							<span
								className={cn(
									"truncate text-xs",
									item.warning ? "text-warning" : "text-muted-foreground",
								)}
							>
								{item.summary}
							</span>
						</span>
						{item.path === repository.path && (
							<Check className="text-primary" aria-label="Selecionado" />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<a href={addRepositoryHref}>
						<Plus aria-hidden="true" />
						Adicionar repositório
					</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export {
	AppSidebar,
	type AppSidebarItem,
	type AppSidebarProps,
	type AppSidebarRepository,
};
