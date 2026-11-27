import { Card } from "@spek/ui/components/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@spek/ui/components/input-group";
import {
	OpenspecTree,
	type OpenspecTreeNode,
} from "@spek/ui/components/openspec-tree";
import { PageHeader } from "@spek/ui/components/page-header";
import type { ReaderFontSize } from "@spek/ui/components/reader-header";
import { SpecReader } from "@spek/ui/components/spec-reader";
import { ToggleGroup, ToggleGroupItem } from "@spek/ui/components/toggle-group";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { specs } from "./dados-exemplo";

function montarArvore(atual: string, termo: string): OpenspecTreeNode[] {
	const visiveis = specs.filter((spec) => spec.capability.includes(termo));
	return [
		{
			label: "specs",
			folder: true,
			count: specs.length,
			children: visiveis.map((spec) => ({
				label: spec.capability,
				href: `/specs?spec=${spec.capability}`,
				count: spec.requirements.length,
				current: spec.capability === atual,
			})),
		},
	];
}

export function Specs({ spec }: { spec?: string }) {
	const [busca, setBusca] = useState("");
	const [fonte, setFonte] = useState<ReaderFontSize>("md");

	const capability = spec ?? specs[0]?.capability ?? "";
	const selecionada = specs.find((item) => item.capability === capability);
	const arvore = useMemo(
		() => montarArvore(capability, busca.trim().toLowerCase()),
		[capability, busca],
	);

	return (
		<AppLayout activeHref="/specs">
			<PageHeader
				title="Specs"
				description={
					<>
						Comportamento atual do sistema, em{" "}
						<span className="font-mono text-foreground">openspec/specs/</span>
					</>
				}
			>
				<ToggleGroup
					type="single"
					variant="outline"
					aria-label="Tamanho da fonte"
					value={fonte}
					onValueChange={(next) => {
						if (next) setFonte(next as ReaderFontSize);
					}}
				>
					<ToggleGroupItem
						value="sm"
						aria-label="Fonte pequena"
						className="text-xs"
					>
						A
					</ToggleGroupItem>
					<ToggleGroupItem value="md" aria-label="Fonte média">
						A
					</ToggleGroupItem>
					<ToggleGroupItem
						value="lg"
						aria-label="Fonte grande"
						className="text-base"
					>
						A
					</ToggleGroupItem>
				</ToggleGroup>
			</PageHeader>

			<Card className="flex-1 flex-col gap-0 py-0 lg:flex-row">
				<div className="flex flex-col gap-1 border-b pt-3 lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
					<InputGroup className="mx-3 h-8 w-auto bg-background/40">
						<InputGroupAddon>
							<Search aria-hidden="true" />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							aria-label="Buscar spec"
							placeholder="Buscar spec"
							value={busca}
							onChange={(event) => setBusca(event.target.value)}
						/>
					</InputGroup>
					<OpenspecTree nodes={arvore} />
				</div>

				<main className="flex min-w-0 flex-1 justify-center px-5 pt-10 pb-20 md:px-8">
					{selecionada ? (
						<SpecReader
							capability={selecionada.capability}
							purpose={selecionada.purpose}
							requirements={selecionada.requirements}
							changes={selecionada.changes}
							updated={selecionada.updated}
							fontSize={fonte}
						/>
					) : (
						<p className="text-muted-foreground text-sm">
							Spec <span className="font-mono">{capability}</span> não
							encontrada.
						</p>
					)}
				</main>
			</Card>
		</AppLayout>
	);
}
