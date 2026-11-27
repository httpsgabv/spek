import { Button } from "@spek/ui/components/button";
import { cn } from "@spek/ui/lib/utils";

type OpenspecTreeNode = {
	label: string;
	href?: string;
	/** Quantidade exibida à direita (requisitos, changes...). */
	count?: number;
	current?: boolean;
	/** Pasta de grupo (specs, changes, archive), em fonte normal. */
	folder?: boolean;
	muted?: boolean;
	children?: OpenspecTreeNode[];
};

const indent = ["pl-2", "pl-5", "pl-8", "pl-11"];

function TreeRow({ node, depth }: { node: OpenspecTreeNode; depth: number }) {
	const className = cn(
		"h-auto w-full justify-between gap-2 rounded-md py-1.5 pr-2 font-normal text-xs",
		indent[Math.min(depth, indent.length - 1)],
		node.folder
			? "pt-2.5 font-medium text-[13px] text-foreground/85"
			: "font-mono text-muted-foreground",
		node.muted && "text-muted-foreground",
		node.current && "border-primary border-l-2 bg-accent text-foreground",
	);
	const content = (
		<>
			<span className="truncate">{node.label}</span>
			{node.count !== undefined && (
				<span className="font-mono text-[11px] text-muted-foreground">
					{node.count}
				</span>
			)}
		</>
	);

	if (node.href) {
		return (
			<Button variant="ghost" asChild className={className}>
				<a href={node.href} aria-current={node.current ? "page" : undefined}>
					{content}
				</a>
			</Button>
		);
	}
	return <div className={cn("flex items-center", className)}>{content}</div>;
}

function TreeNodes({
	nodes,
	depth,
}: {
	nodes: OpenspecTreeNode[];
	depth: number;
}) {
	return (
		<ul className="flex flex-col gap-0.5">
			{nodes.map((node) => (
				<li key={`${depth}-${node.label}`}>
					<TreeRow node={node} depth={depth} />
					{node.children && node.children.length > 0 && (
						<TreeNodes nodes={node.children} depth={depth + 1} />
					)}
				</li>
			))}
		</ul>
	);
}

/** Árvore de arquivos da pasta `openspec/`. */
function OpenspecTree({
	nodes,
	className,
}: {
	nodes: OpenspecTreeNode[];
	className?: string;
}) {
	return (
		<nav
			aria-label="Árvore do openspec"
			className={cn("flex flex-col gap-1 px-2.5 py-4", className)}
		>
			<h2 className="px-2 pb-2 text-[11px] text-muted-foreground uppercase tracking-wider">
				openspec/
			</h2>
			{nodes.length > 0 ? (
				<TreeNodes nodes={nodes} depth={0} />
			) : (
				<p className="px-2 text-muted-foreground text-xs">
					Nenhum arquivo encontrado.
				</p>
			)}
		</nav>
	);
}

export { OpenspecTree, type OpenspecTreeNode };
