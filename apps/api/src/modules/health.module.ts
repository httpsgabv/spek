import { Module } from "@nestjs/common";
import { HealthController } from "../presentation/controllers/health/health.controller";

@Module({ controllers: [HealthController] })
export class HealthModule {}
