import { Badge } from "@spek/ui/components/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@spek/ui/components/tooltip";
import { cn } from "@spek/ui/lib/utils";

type ChangeFile = "proposal" | "specs" | "design" | "tasks";

const changeFiles: Record<ChangeFile, { letter: string; label: string }> = {
	proposal: { letter: "P", label: "proposal.md" },
	specs: { letter: "S", label: "specs/ (deltas)" },
	design: { letter: "D", label: "design.md" },
	tasks: { letter: "T", label: "tasks.md" },
};

const changeFileOrder: ChangeFile[] = ["proposal", "specs", "design", "tasks"];

function ChangeFileBadge({
	file,
	present = true,
	className,
}: {
	file: ChangeFile;
	present?: boolean;
	className?: string;
}) {
	return (
		<Badge
			variant={present ? "secondary" : "outline"}
			className={cn(
				"size-5 rounded-sm px-0 font-mono font-semibold text-[10px]",
				!present && "border-dashed text-muted-foreground",
				className,
			)}
		>
			{changeFiles[file].letter}
		</Badge>
	);
}

function ChangeFiles({ files }: { files: ChangeFile[] }) {
	return (
		<TooltipProvider>
			<ul aria-label="Arquivos da change" className="flex items-center gap-1.5">
				{changeFileOrder.map((file) => {
					const present = files.includes(file);
					const label = `${changeFiles[file].label}${present ? "" : " (ausente)"}`;
					return (
						<li key={file}>
							<Tooltip>
								<TooltipTrigger asChild>
									<span aria-label={label}>
										<ChangeFileBadge file={file} present={present} />
									</span>
								</TooltipTrigger>
								<TooltipContent>{label}</TooltipContent>
							</Tooltip>
						</li>
					);
				})}
			</ul>
		</TooltipProvider>
	);
}

function ChangeFilesLegend({ className }: { className?: string }) {
	return (
		<ul
			aria-label="Legenda dos arquivos"
			className={cn(
				"flex flex-wrap gap-4 text-muted-foreground text-xs",
				className,
			)}
		>
			{changeFileOrder.map((file) => (
				<li key={file} className="flex items-center gap-1.5">
					<ChangeFileBadge file={file} />
					{changeFiles[file].label}
				</li>
			))}
			<li className="flex items-center gap-1.5">
				<ChangeFileBadge file="design" present={false} />
				arquivo ausente
			</li>
		</ul>
	);
}

export {
	type ChangeFile,
	ChangeFileBadge,
	ChangeFiles,
	ChangeFilesLegend,
	changeFiles,
};
