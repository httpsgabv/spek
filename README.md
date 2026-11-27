# spek

Interface web para operar o [OpenSpec](https://github.com/Fission-AI/OpenSpec) CLI.

| Parte    | Pasta                | Stack                                               |
| -------- | -------------------- | --------------------------------------------------- |
| Front    | `apps/web`           | TanStack Start, React 19, Tailwind v4, shadcn/ui    |
| API      | `apps/api`           | NestJS 11 (Fastify), Zod, OpenAPI                   |
| Contrato | `packages/contracts` | OpenAPI + cliente React Query/Zod gerado pelo Orval |
| UI       | `packages/ui`        | Componentes shadcn/ui, tema Tailwind                |
| Config   | `packages/config`    | Biome e tsconfig compartilhados                     |

## Começando

Requisitos: Node 24, pnpm 10, Docker (opcional, para o Postgres).

```sh
pnpm install
pnpm dev          # web em http://localhost:3000, API em http://localhost:4000 (Swagger em /docs)
```

Postgres local (ainda sem uso pela API): copie `.env.example` para `.env`, defina `POSTGRES_PASSWORD` e rode `pnpm db:up`.

Comandos e regras de trabalho estão no [CLAUDE.md](CLAUDE.md).
