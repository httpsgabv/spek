import type { INestApplication } from "@nestjs/common";
import {
	DocumentBuilder,
	type OpenAPIObject,
	type SchemaObject,
	SwaggerModule,
} from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
import { z } from "zod";

const problemDetailSchema = z.object({
	type: z.string(),
	title: z.string(),
	status: z.number().int(),
	detail: z.string(),
	instance: z.string(),
	errors: z
		.array(z.object({ field: z.string(), message: z.string() }))
		.optional(),
});

// Todo endpoint documenta ProblemDetail como resposta de erro: o cliente
// gerado (Orval) tipa o erro sem configuração extra.
export function criarDocumentoOpenApi(app: INestApplication): OpenAPIObject {
	const config = new DocumentBuilder()
		.setTitle("spek-api")
		.setVersion("0.1.0")
		.setOpenAPIVersion("3.1.0")
		.build();
	const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));

	const { $schema: _, ...problemDetail } = z.toJSONSchema(problemDetailSchema);
	document.components = {
		...document.components,
		schemas: {
			...document.components?.schemas,
			ProblemDetail: problemDetail as SchemaObject,
		},
	};
	for (const path of Object.values(document.paths)) {
		for (const operation of Object.values(path)) {
			if (typeof operation !== "object" || !("responses" in operation)) {
				continue;
			}
			operation.responses.default ??= {
				description: "Erro",
				content: {
					"application/problem+json": {
						schema: { $ref: "#/components/schemas/ProblemDetail" },
					},
				},
			};
		}
	}
	return document;
}
