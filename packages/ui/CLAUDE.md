# CLAUDE.md — design system

Componentes shadcn/ui (estilo `radix-nova`), tema e estilos globais.

## Regras

- **shadcn primeiro.** Antes de escrever um componente, veja se o shadcn já tem um (https://ui.shadcn.com/docs/components). Se tem, adicione e use.
- Componente novo só quando nenhum do shadcn resolve, e montado a partir dos componentes shadcn (Card, Button, Table...), nunca com HTML e estilos do zero.
- Não edite os componentes gerados pelo shadcn para mudar a aparência: use `className`, variantes ou os tokens do tema.
- Cores, raio e fonte só como tokens em `src/styles/globals.css`. Nada de cor fixa (`#hex`) nos componentes.
- Ícones: `lucide-react`.

## Adicionar componente

Em `apps/web/`: `pnpm dlx shadcn@latest add <nome>`. Os arquivos vão para `src/components/`.

O CLI do shadcn falha quando o caminho do projeto tem ponto (ex.: `C:\Users\nome.sobrenome`). Nesse caso, mapeie a raiz num drive (`subst S: <raiz>`), rode o comando em `S:\packages\ui` e depois remova o drive (`subst S: /D`).
