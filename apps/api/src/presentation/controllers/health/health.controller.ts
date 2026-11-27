import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { HealthSaidaDto } from "../../dtos/health/health-saida.dto";

@ApiTags("health")
@Controller("health")
export class HealthController {
	@Get()
	@ApiOperation({ operationId: "consultarHealth" })
	@ZodResponse({ status: 200, type: HealthSaidaDto })
	consultar(): HealthSaidaDto {
		return { status: "ok" };
	}
}
