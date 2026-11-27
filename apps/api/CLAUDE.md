# CLAUDE.md — API

Rode os comandos dentro de `apps/api/`.

## Stack

Node 24, TypeScript `strict` (CommonJS), NestJS 11 (Fastify), Zod 4 + `nestjs-zod`, `@nestjs/swagger` (OpenAPI 3.1), Vitest (+ SWC) + Supertest, Biome, dependency-cruiser, pnpm. Banco: Postgres no `compose.yaml` da raiz; Prisma entra quando a primeira spec precisar de persistência.

## Arquitetura: clean architecture, organizada por feature

```
src/
  main.ts, criar-app.ts, app.module.ts, exportar-openapi.ts
  modules/                   composition root: <feature>.module.ts liga as camadas
  core/
    domain/<feature>/        entidades (classe que estende Entity), enums, erros, portas (abstract class)
    usecases/<feature>/      um use case por classe, único método público executar(), devolve Either
    util/                    Entity, UniqueEntityId, Either, ErroDeDominio, UseCase, Optional
  infrastructure/            persistence/, integrations/<sistema>/, security/, config/
  presentation/              controllers/<contexto>/, dtos/<feature>/, filters/, openapi/, validation/
tests/integration/
tests/e2e/
```

Dependência: `presentation → core ← infrastructure`.

- `core` não importa `presentation`, `infrastructure` nem `modules`.
- `core/domain` e `core/util` não importam Nest, Fastify, Prisma nem Zod. Em `core/usecases` o Nest entra só para `@Injectable()` (e `Logger`).
- `presentation` e `infrastructure` não se importam.
- Só `modules/`, `app.module.ts`, `criar-app.ts`, `main.ts` e `exportar-openapi.ts` importam tudo. Verificado por `pnpm deps:check`.

## Regras de design

- **Entidade**: classe em `core/domain/<feature>/` que estende `Entity<Props>`, com construtor protegido, `static criar(...)` e métodos que mudam estado validando a regra. O id (UUID) nasce na entidade.
- **Use case devolve `Either<ErroDeDominio, Resultado>`, não lança.** Uma classe de erro por regra violada, estendendo `ErroDeDominio` (`codigo`, mensagem, `status` HTTP).
- **Portas são `abstract class`** (a classe é o token de injeção do Nest), em `core/domain/<feature>/`: `<Entidade>Repository` para persistência e `<Sistema>Port` para integração externa (OpenSpec CLI, sistema de arquivos, APIs de terceiros). A implementação fica em `infrastructure/persistence/` ou `infrastructure/integrations/<sistema>/` e é ligada no `<feature>.module.ts`.
- Escrita passa pela entidade: carrega pelo repositório, confere a regra, muda pela entidade, salva, devolve a entidade.
- Model do banco não sai de `infrastructure`: um mapper converte linha ↔ entidade.
- Zod é a fonte do tipo na borda: `<entidade>EntradaSchema` gera `<Entidade>EntradaDto` via `createZodDto`. Resposta tipada com `@ZodResponse`.
- Um controller por contexto de negócio: recebe, valida e chama o use case. Sem `try/catch`: em `failure`, faz `throw resultado.value` e o filtro global (`ProblemDetailFilter`, RFC 7807) responde com o status do erro.
- Herança e decorators próprios são permitidos. Interface com uma única implementação e padrão de projeto (factory, strategy...) só com justificativa registrada nas decisões técnicas da spec.
- Variáveis de ambiente só em `infrastructure/config/env.ts`, validadas com Zod; variável nova entra também no `.env.example`. Nada de `process.env` fora dela.
- O serviço publica o próprio OpenAPI em `packages/contracts`: mudou endpoint, rode `pnpm contracts:generate` na raiz na mesma tarefa. Todo endpoint tem `operationId` (vira o nome do hook gerado).
- Execução de processo externo (OpenSpec CLI) só pelo adapter, com argumentos em array (`execFile`/`spawn` sem shell), nunca concatenando texto do usuário num comando.

## Segurança

- Todo endpoint exige autenticação por padrão (guard global) quando houver autenticação. Rota pública é marcada explicitamente e justificada na spec.
- Autorização (quem pode fazer o quê) é verificada no backend em toda operação, nunca só escondendo botão no front.
- Toda entrada é validada com Zod na borda (body, params, query, headers usados).
- Caminho de arquivo vindo do usuário é resolvido e conferido contra a raiz permitida antes de ler ou escrever (sem `..` escapando).
- SQL só pelo ORM. Query crua só com parâmetros, nunca concatenando texto.
- Resposta de erro sem stack trace, SQL ou mensagem interna; o detalhe vai para o log.
- CORS só para origens conhecidas (`CORS_ORIGINS`). Limite de requisições em login e endpoints sensíveis.
- Upload: valide tipo e tamanho; nunca use o nome enviado pelo usuário como caminho de arquivo.
- Senha só com hash (bcrypt ou argon2), nunca em texto puro nem com criptografia reversível.

## Nomes

Negócio em português, termo técnico em inglês. Sem acento nem `ç` em identificadores e arquivos (`Atualizacao`).

- Use case CRUD: `<Consultar|Listar|Cadastrar|Atualizar|Remover><Entidade>UseCase`. Fora de CRUD: verbo no infinitivo + entidade (`ArquivarMudancaUseCase`). Nunca Buscar, Obter, Get, Find ou Create.
- Entidade sempre no singular, inclusive em listas: `ListarMudancaUseCase`.
- `<Contexto>Controller`, `<Entidade>Repository` (métodos `porId`, `listar`, `cadastrar`, `atualizar`, `remover`), `<Entidade><Entrada|Saida>Dto`, `<Sistema>Port`, `<Sistema>Adapter`, `<Feature>Module`, `<Regra>Erro` (estende `ErroDeDominio`).
- Arquivo em kebab-case com sufixo de tipo (`consultar-mudanca.usecase.ts`, `mudanca-nao-encontrada.erro.ts`); pasta em kebab-case, feature no singular.
- Variável em camelCase; booleano lido como pergunta (`possuiAnexo`); função em camelCase com verbo no infinitivo (`calcularImposto`); constante em UPPER_SNAKE_CASE; enum em PascalCase com valores em UPPER_SNAKE_CASE (`StatusMudanca.EM_ANDAMENTO`); schema Zod em camelCase + `Schema`.
- Banco (quando houver): um schema por módulo; tabelas no singular e colunas em snake_case; PK `id`, FK `<tabela>_id`. No Prisma, modelo em PascalCase com `@@map` e `@map`.

## Testes

- Todo cenário ou critério de aceite da spec tem teste (`describe` = requisito, `test` = cenário), escrito junto com o código. TDD não é exigido.
- Unitário ao lado do arquivo (`*.test.ts`): entidade e use case (com repositório/porta em memória). Integração em `tests/integration/` com Supertest sobre `criarApp()`; e2e em `tests/e2e/`.
- Durante a tarefa, rode só os testes relacionados. E2E só antes do push, com confirmação do usuário.
- Proibido `skip`, `only`, apagar teste ou escrever teste sem assert.

## Antes de concluir uma tarefa

Biome sem erro nos arquivos alterados, `deps:check` sem violação, `check-types` sem erro e testes relacionados passando.

## Comandos

| Ação                     | Comando                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Rodar                    | `pnpm dev` (porta 4000, Swagger em `/docs`)                  |
| Build                    | `pnpm build`                                                 |
| Testes relacionados      | `pnpm vitest related --run <arquivos>`                       |
| Unitários / integração   | `pnpm test:unit` / `pnpm test:integration`                   |
| Todos os testes          | `pnpm test`                                                  |
| E2E (só com confirmação) | `pnpm vitest run --project e2e`                              |
| Lint                     | `pnpm biome check --write <arquivos>`                        |
| Camadas                  | `pnpm deps:check`                                            |
| Tipos                    | `pnpm check-types`                                           |
| Exportar OpenAPI         | `pnpm openapi:export` (ou `pnpm contracts:generate` na raiz) |
