import { Button } from "@spek/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@spek/ui/components/card";
import { Input } from "@spek/ui/components/input";
import { Label } from "@spek/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@spek/ui/components/select";
import { Separator } from "@spek/ui/components/separator";
import { Switch } from "@spek/ui/components/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@spek/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@spek/ui/components/tabs";
import { cn } from "@spek/ui/lib/utils";
import { Check, TriangleAlert } from "lucide-react";
import type * as React from "react";

type SettingsSection = { id: string; label: string };

/** Abas que levam até cada seção da página (todas ficam visíveis). */
function SettingsNav({
	sections,
	value,
	onValueChange,
}: {
	sections: SettingsSection[];
	value: string;
	onValueChange: (id: string) => void;
}) {
	return (
		<Tabs value={value} onValueChange={onValueChange} className="px-1.5">
			<TabsList
				variant="line"
				aria-label="Seções"
				className="h-auto w-full justify-start gap-1 border-b pb-1"
			>
				{sections.map((section) => (
					<TabsTrigger
						key={section.id}
						value={section.id}
						className="flex-none px-3 py-1.5 data-active:font-semibold group-data-[variant=line]/tabs-list:data-active:after:bg-primary"
					>
						{section.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}

function SettingsCard({
	id,
	title,
	description,
	children,
	className,
}: {
	id: string;
	title: string;
	description?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card
			id={id}
			aria-labelledby={`${id}-titulo`}
			role="region"
			className={cn("scroll-mt-4 gap-4 px-1 py-5", className)}
		>
			<CardHeader>
				<CardTitle>
					<h2 id={`${id}-titulo`} className="font-semibold text-[15px]">
						{title}
					</h2>
				</CardTitle>
				{description && (
					<CardDescription className="text-xs">{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-3.5">{children}</CardContent>
		</Card>
	);
}

function SettingsSwitchRow({
	id,
	label,
	description,
	checked,
	onCheckedChange,
}: {
	id: string;
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-3">
			<Label htmlFor={id} className="flex-col items-start gap-0.5 font-normal">
				{label}
				<span className="text-muted-foreground text-xs">{description}</span>
			</Label>
			<Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}

type SettingsRepository = {
	name: string;
	path: string;
	initials: string;
	/** Resumo do `openspec/` (ex.: `openspec/ ok · 9 changes`). */
	status: string;
	warning?: boolean;
	baseBranch: string;
	/** Última leitura, já formatada. */
	readAt: string;
};

/** Resultado da checagem do caminho digitado. */
type SettingsPathCheck = { ok: boolean; message: string };

type RepositoriesSettingsProps = {
	repositories: SettingsRepository[];
	path: string;
	onPathChange: (path: string) => void;
	pathCheck?: SettingsPathCheck;
	onBrowse: () => void;
	onAdd: () => void;
	onReload: (path: string) => void;
	onRemove: (path: string) => void;
};

function RepositoriesSettings({
	repositories,
	path,
	onPathChange,
	pathCheck,
	onBrowse,
	onAdd,
	onReload,
	onRemove,
}: RepositoriesSettingsProps) {
	return (
		<SettingsCard
			id="repos"
			title="Repositórios"
			description={
				<>
					Cada repositório precisa ter uma pasta{" "}
					<span className="font-mono text-foreground/85">openspec/</span> na
					raiz. O app só lê os arquivos.
				</>
			}
		>
			<form
				className="flex flex-col gap-2"
				onSubmit={(event) => {
					event.preventDefault();
					onAdd();
				}}
			>
				<div className="flex flex-wrap items-end gap-2">
					<div className="flex min-w-0 flex-[1_1_22.5rem] flex-col gap-1.5">
						<Label
							htmlFor="caminho-repositorio"
							className="font-normal text-muted-foreground text-xs"
						>
							Caminho do repositório
						</Label>
						<Input
							id="caminho-repositorio"
							value={path}
							onChange={(event) => onPathChange(event.target.value)}
							aria-invalid={pathCheck && !pathCheck.ok ? true : undefined}
							aria-describedby={pathCheck ? "caminho-checagem" : undefined}
							className={cn(
								"h-9.5 font-mono",
								pathCheck?.ok && "border-primary",
							)}
						/>
					</div>
					<Button
						type="button"
						variant="outline"
						className="h-9.5 px-3.5"
						onClick={onBrowse}
					>
						Procurar…
					</Button>
					<Button
						type="submit"
						disabled={!path.trim()}
						className="h-9.5 bg-foreground px-4 font-semibold text-background hover:bg-foreground/85"
					>
						Adicionar
					</Button>
				</div>
				{pathCheck && (
					<p
						id="caminho-checagem"
						className={cn(
							"flex items-center gap-1.5 text-xs",
							pathCheck.ok ? "text-primary" : "text-warning",
						)}
					>
						{pathCheck.ok ? (
							<Check className="size-3" aria-hidden="true" />
						) : (
							<TriangleAlert className="size-3" aria-hidden="true" />
						)}
						{pathCheck.message}
					</p>
				)}
			</form>

			<Table className="min-w-190">
				<TableHeader>
					<TableRow className="text-[11px] uppercase tracking-wider hover:bg-transparent">
						<TableHead className="text-muted-foreground">Nome</TableHead>
						<TableHead className="text-muted-foreground">Caminho</TableHead>
						<TableHead className="text-muted-foreground">Status</TableHead>
						<TableHead className="text-muted-foreground">Branch base</TableHead>
						<TableHead className="text-muted-foreground">Lido</TableHead>
						<TableHead>
							<span className="sr-only">Ações</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{repositories.map((repository) => (
						<TableRow key={repository.path}>
							<TableCell>
								<span className="flex items-center gap-2.5 font-medium">
									<span
										aria-hidden="true"
										className={cn(
											"flex size-6.5 shrink-0 items-center justify-center rounded-md font-bold text-[10px]",
											repository.warning
												? "bg-muted text-foreground"
												: "bg-primary text-primary-foreground",
										)}
									>
										{repository.initials}
									</span>
									{repository.name}
								</span>
							</TableCell>
							<TableCell className="font-mono text-muted-foreground text-xs">
								{repository.path}
							</TableCell>
							<TableCell>
								<span
									className={cn(
										"flex items-center gap-1.5 text-xs",
										repository.warning ? "text-warning" : "text-primary",
									)}
								>
									<span
										aria-hidden="true"
										className="size-1.5 rounded-full bg-current"
									/>
									{repository.status}
								</span>
							</TableCell>
							<TableCell className="font-mono text-xs">
								{repository.baseBranch}
							</TableCell>
							<TableCell className="text-muted-foreground text-xs">
								{repository.readAt}
							</TableCell>
							<TableCell>
								<span className="flex justify-end gap-1.5">
									<Button
										variant="outline"
										size="sm"
										aria-label={`Reler ${repository.name}`}
										onClick={() => onReload(repository.path)}
									>
										Reler
									</Button>
									<Button
										variant="outline"
										size="sm"
										aria-label={`Remover ${repository.name}`}
										onClick={() => onRemove(repository.path)}
										className="text-destructive hover:text-destructive"
									>
										Remover
									</Button>
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</SettingsCard>
	);
}

type GitSettingsValue = { includeRemotes: boolean; linkByMessage: boolean };

function GitSettings({
	executable,
	value,
	onChange,
	className,
}: {
	executable: string;
	value: GitSettingsValue;
	onChange: (value: GitSettingsValue) => void;
	className?: string;
}) {
	return (
		<SettingsCard id="git" title="Git" className={className}>
			<div className="flex items-center justify-between gap-3">
				<span className="flex flex-col gap-0.5">
					Executável
					<span className="text-muted-foreground text-xs">
						Detectado automaticamente no PATH
					</span>
				</span>
				<span className="font-mono text-foreground/85 text-xs">
					{executable}
				</span>
			</div>
			<Separator />
			<SettingsSwitchRow
				id="git-remotas"
				label="Incluir branches remotas"
				description="Usa o último fetch; o app não faz fetch sozinho"
				checked={value.includeRemotes}
				onCheckedChange={(includeRemotes) =>
					onChange({ ...value, includeRemotes })
				}
			/>
			<Separator />
			<SettingsSwitchRow
				id="git-mensagem"
				label="Ligar commits a changes pela mensagem"
				description="Além dos arquivos em openspec/, cita o id da change"
				checked={value.linkByMessage}
				onCheckedChange={(linkByMessage) =>
					onChange({ ...value, linkByMessage })
				}
			/>
		</SettingsCard>
	);
}

type AssistantSettingsValue = {
	provider: string;
	apiKey: string;
	openspecOnly: boolean;
};

function AssistantSettings({
	providers,
	value,
	onChange,
	className,
}: {
	providers: { value: string; label: string }[];
	value: AssistantSettingsValue;
	onChange: (value: AssistantSettingsValue) => void;
	className?: string;
}) {
	return (
		<SettingsCard id="ia" title="Assistente IA" className={className}>
			<div className="flex flex-col gap-1.5">
				<Label
					htmlFor="ia-provedor"
					className="font-normal text-muted-foreground text-xs"
				>
					Provedor
				</Label>
				<Select
					value={value.provider}
					onValueChange={(provider) => onChange({ ...value, provider })}
				>
					<SelectTrigger id="ia-provedor" className="h-9.5 w-full">
						<SelectValue placeholder="Selecione o provedor" />
					</SelectTrigger>
					<SelectContent>
						{providers.map((provider) => (
							<SelectItem key={provider.value} value={provider.value}>
								{provider.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label
					htmlFor="ia-chave"
					className="font-normal text-muted-foreground text-xs"
				>
					Chave de API
				</Label>
				<Input
					id="ia-chave"
					type="password"
					autoComplete="off"
					placeholder="Cole a chave do provedor"
					value={value.apiKey}
					onChange={(event) =>
						onChange({ ...value, apiKey: event.target.value })
					}
					className="h-9.5 font-mono"
				/>
			</div>
			<SettingsSwitchRow
				id="ia-openspec"
				label="Enviar só arquivos de openspec/"
				description="Código-fonte e diffs só quando citados na conversa"
				checked={value.openspecOnly}
				onCheckedChange={(openspecOnly) => onChange({ ...value, openspecOnly })}
			/>
		</SettingsCard>
	);
}

export {
	AssistantSettings,
	type AssistantSettingsValue,
	GitSettings,
	type GitSettingsValue,
	RepositoriesSettings,
	type RepositoriesSettingsProps,
	SettingsNav,
	type SettingsPathCheck,
	type SettingsRepository,
	type SettingsSection,
};
