import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { criarApp } from "../../src/criar-app";

describe("GET /api/health", () => {
	let app: NestFastifyApplication;

	beforeAll(async () => {
		process.env.APP_ENV = "test";
		app = await criarApp({ logger: false });
		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	afterAll(async () => {
		await app.close();
	});

	test("responde ok quando a API está de pé", async () => {
		const resposta = await request(app.getHttpServer()).get("/api/health");

		expect(resposta.status).toBe(200);
		expect(resposta.body).toEqual({ status: "ok" });
	});

	test("responde ProblemDetail 404 em rota inexistente", async () => {
		const resposta = await request(app.getHttpServer()).get("/api/nao-existe");

		expect(resposta.status).toBe(404);
		expect(resposta.headers["content-type"]).toContain(
			"application/problem+json",
		);
		expect(resposta.body).toMatchObject({
			status: 404,
			instance: "/api/nao-existe",
		});
	});
});
