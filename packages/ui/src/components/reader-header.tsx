import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@spek/ui/components/breadcrumb";
import { Button } from "@spek/ui/components/button";
import { ButtonGroup } from "@spek/ui/components/button-group";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@spek/ui/components/input-group";
import { Kbd } from "@spek/ui/components/kbd";
import { ChevronLeft, Search } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

type ReaderFontSize = "sm" | "md" | "lg";

const fontSizes: ReaderFontSize[] = ["sm", "md", "lg"];

type ReaderHeaderProps = {
	backHref: string;
	/** Iniciais do repositório aberto. */
	repositoryInitials: string;
	/** Caminho até o arquivo; o último item é a página atual. */
	path: string[];
	search: string;
	onSearchChange: (value: string) => void;
	fontSize: ReaderFontSize;
	onFontSizeChange: (value: ReaderFontSize) => void;
};

function ReaderHeader({
	backHref,
	repositoryInitials,
	path,
	search,
	onSearchChange,
	fontSize,
	onFontSizeChange,
}: ReaderHeaderProps) {
	const index = fontSizes.indexOf(fontSize);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function focusSearch(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				searchRef.current?.focus();
			}
		}
		window.addEventListener("keydown", focusSearch);
		return () => window.removeEventListener("keydown", focusSearch);
	}, []);

	return (
		<header className="flex flex-wrap items-center gap-3 border-b bg-sidebar px-4 py-2.5">
			<Button variant="outline" asChild>
				<a href={backHref}>
					<ChevronLeft data-icon="inline-start" />
					Voltar
				</a>
			</Button>
			<span
				aria-hidden="true"
				className="flex size-6 items-center justify-center rounded-md bg-primary font-bold text-[10px] text-primary-foreground"
			>
				{repositoryInitials}
			</span>
			<Breadcrumb>
				<BreadcrumbList className="gap-1 font-mono text-xs sm:gap-1">
					{path.map((part, partIndex) => {
						const last = partIndex === path.length - 1;
						return (
							<Fragment key={part}>
								<BreadcrumbItem>
									{last ? (
										<BreadcrumbPage className="font-normal">
											{part}
										</BreadcrumbPage>
									) : (
										part
									)}
								</BreadcrumbItem>
								{!last && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
							</Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="ml-auto flex flex-wrap items-center gap-2">
				<InputGroup className="w-56">
					<InputGroupAddon>
						<Search aria-hidden="true" />
					</InputGroupAddon>
					<InputGroupInput
						ref={searchRef}
						type="search"
						aria-label="Buscar nas specs"
						placeholder="Buscar nas specs"
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						className="text-xs"
					/>
					<InputGroupAddon align="inline-end">
						<Kbd>⌘K</Kbd>
					</InputGroupAddon>
				</InputGroup>
				<ButtonGroup aria-label="Tamanho da fonte">
					<Button
						variant="outline"
						size="icon"
						aria-label="Diminuir fonte"
						disabled={index === 0}
						onClick={() => onFontSizeChange(fontSizes[index - 1] ?? fontSize)}
						className="text-xs"
					>
						A−
					</Button>
					<Button
						variant="outline"
						size="icon"
						aria-label="Aumentar fonte"
						disabled={index === fontSizes.length - 1}
						onClick={() => onFontSizeChange(fontSizes[index + 1] ?? fontSize)}
					>
						A+
					</Button>
				</ButtonGroup>
			</div>
		</header>
	);
}

export { type ReaderFontSize, ReaderHeader, type ReaderHeaderProps };
