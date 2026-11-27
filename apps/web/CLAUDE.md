# CLAUDE.md — front web

## Stack

React 19 + TanStack Start (Router + Query), TypeScript `strict`, Tailwind v4, shadcn/ui (estilo `radix-nova`), Zod, Biome. Testes: Vitest + Testing Library (jsdom).

## Estrutura

```
src/
  routes/               rotas por arquivo (TanStack Router); routeTree.gen.ts é gerado, não edite
  features/<feature>/   componentes, hooks e testes de uma feature
  components/           componentes do app que não são do design system
  styles/app.css        importa `@spek/ui/globals.css` (Tailwind + tema)
```

Import absoluto com `@/` (aponta para `src/`).

## Design system (`packages/ui`)

- Componentes shadcn vivem em `packages/ui`, não no app. Import: `@spek/ui/components/<nome>`; `cn` em `@spek/ui/lib/utils`.
- Adicionar componente: rode em `apps/web/` `pnpm dlx shadcn@latest add <nome>`; o `components.json` do app aponta para `packages/ui`.
- Tema (tokens de cor, raio, fonte) só em `packages/ui/src/styles/globals.css`.

## Regras

- Dados da API só pelo cliente gerado em `@spek/contracts` (hooks do React Query). Nunca `fetch` escrito à mão.
- Schemas Zod do contrato em `@spek/contracts/zod`, para validar formato de entrada em formulário.
- Regra de negócio fica no backend; o front valida só formato de entrada.
- Arquivos e pastas em kebab-case; componentes em PascalCase.
- Todo cenário de tela do spec tem teste (`describe` = requisito, `test` = cenário), ao lado do componente (`*.test.tsx`). Mocke a rede com `vi.stubGlobal("fetch", ...)`.
- Em dev o Vite repassa `/api` para a API (`localhost:4000`).

## Segurança

- Tudo que vai para o navegador é público: nenhum segredo em variável de ambiente exposta ao cliente nem no código do front.
- Token de sessão em cookie `HttpOnly` e `Secure`, nunca em `localStorage`.
- Não use `dangerouslySetInnerHTML` com conteúdo vindo do usuário ou da API.
- Esconder botão não é controle de acesso: a permissão é sempre verificada no backend.

## Comandos

Rode dentro de `apps/web/`.

| Ação                | Comando                                |
| ------------------- | -------------------------------------- |
| Rodar               | `pnpm dev`                             |
| Build               | `pnpm build`                           |
| Testes              | `pnpm test`                            |
| Testes relacionados | `pnpm vitest related --run <arquivos>` |
| Tipos               | `pnpm check-types`                     |
| Lint                | `pnpm biome check --write <arquivos>`  |
