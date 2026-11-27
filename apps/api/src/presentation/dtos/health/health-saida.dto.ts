import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const healthSaidaSchema = z
	.object({ status: z.literal("ok") })
	.meta({ id: "HealthSaida" });

export class HealthSaidaDto extends createZodDto(healthSaidaSchema) {}
