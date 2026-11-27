import { Button } from "@spek/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@spek/ui/components/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@spek/ui/components/input-group";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@spek/ui/components/toggle-group";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

const ALL = "todas";

type KanbanView = "quadro" | "lista";

type KanbanViewToggleProps = {
	value: KanbanView;
	onValueChange: (value: KanbanView) => void;
};

function KanbanViewToggle({ value, onValueChange }: KanbanViewToggleProps) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(next) => next && onValueChange(next as KanbanView)}
			spacing={0.5}
			aria-label="Visualização"
			className="rounded-lg border bg-card p-0.5"
		>
			<ToggleGroupItem
				value="quadro"
				className="text-muted-foreground data-[state=on]:text-foreground"
			>
				Quadro
			</ToggleGroupItem>
			<ToggleGroupItem
				value="lista"
				className="text-muted-foreground data-[state=on]:text-foreground"
			>
				Lista
			</ToggleGroupItem>
		</ToggleGroup>
	);
}

type KanbanToolbarProps = {
	search: string;
	onSearchChange: (value: string) => void;
	capabilities: string[];
	/** `null` = todas. */
	capability: string | null;
	onCapabilityChange: (value: string | null) => void;
	authors: { value: string; label: string }[];
	/** `null` = todos. */
	author: string | null;
	onAuthorChange: (value: string | null) => void;
	visibleCapabilities?: number;
};

function KanbanToolbar({
	search,
	onSearchChange,
	capabilities,
	capability,
	onCapabilityChange,
	authors,
	author,
	onAuthorChange,
	visibleCapabilities = 4,
}: KanbanToolbarProps) {
	const [expanded, setExpanded] = useState(false);
	const hidden = capabilities.length - visibleCapabilities;
	const shown =
		expanded || hidden <= 0
			? capabilities
			: capabilities.slice(0, visibleCapabilities);
	const authorLabel =
		authors.find((item) => item.value === author)?.label ?? "todos";
	const chip =
		"rounded-full px-3 text-xs data-[state=on]:bg-foreground data-[state=on]:text-background";

	return (
		<div className="flex flex-wrap items-center gap-2 px-1.5">
			<InputGroup className="h-9 w-70 max-w-full bg-card">
				<InputGroupAddon>
					<Search aria-hidden="true" />
				</InputGroupAddon>
				<InputGroupInput
					type="search"
					aria-label="Buscar change"
					placeholder="Buscar change, requisito…"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
				/>
			</InputGroup>

			<span className="ml-1.5 text-muted-foreground text-xs" id="capability">
				Capability
			</span>
			<ToggleGroup
				type="single"
				size="sm"
				variant="outline"
				aria-labelledby="capability"
				value={capability ?? ALL}
				onValueChange={(next) => {
					if (next) onCapabilityChange(next === ALL ? null : next);
				}}
				className="flex-wrap"
			>
				<ToggleGroupItem value={ALL} className={`${chip} font-semibold`}>
					Todas
				</ToggleGroupItem>
				{shown.map((item) => (
					<ToggleGroupItem
						key={item}
						value={item}
						className={`${chip} bg-card font-mono font-normal`}
					>
						{item}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			{hidden > 0 && (
				<Button
					variant="outline"
					size="sm"
					className="rounded-full bg-card font-mono text-xs"
					aria-expanded={expanded}
					onClick={() => setExpanded((value) => !value)}
				>
					{expanded ? "menos" : `+${hidden}`}
				</Button>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="lg" className="ml-auto bg-card">
						Autor: {authorLabel}
						<ChevronDown className="text-muted-foreground" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuRadioGroup
						value={author ?? ALL}
						onValueChange={(next) => onAuthorChange(next === ALL ? null : next)}
					>
						<DropdownMenuRadioItem value={ALL}>todos</DropdownMenuRadioItem>
						{authors.map((item) => (
							<DropdownMenuRadioItem key={item.value} value={item.value}>
								{item.label}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export {
	type KanbanView,
	KanbanToolbar,
	type KanbanToolbarProps,
	KanbanViewToggle,
	type KanbanViewToggleProps,
};
