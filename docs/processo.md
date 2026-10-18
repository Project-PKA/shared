# Processo: issues, sprints e entrega

> Vale para os quatro repositórios. A fonte do que fazer e em que ordem é o
> [`docs/roadmap.md`](https://github.com/Project-PKA/Backend/blob/HEAD/docs/roadmap.md)
> do Backend e o [`produto.md`](produto.md). Aqui está **como** o trabalho é
> organizado e conduzido.

## Canal do dono

O que depende do dono vai para [`OWNER.md`](../OWNER.md), que é a fonte. A issue com
`decisao-pendente` ou `acao-do-dono` continua existindo como registro e aponta para lá. O agente
lê o `OWNER.md` no início de cada sessão e o atualiza quando algo muda.

## Princípios

- **Uma issue, uma entrega pequena e verificável.** Tamanho `G` pede para quebrar.
- **Sprint é um milestone** do GitHub, com o mesmo nome em todos os repositórios.
  A descrição do milestone é o objetivo da sprint. Não há datas fixas: a sprint
  termina quando o objetivo é atingido, e o que sobrar vai para a seguinte.
- **Decisão não é tarefa de código.** O que depende do dono do produto tem o
  rótulo `decisao-pendente` e uma issue própria; o código que depende dela fica
  `bloqueada` até a decisão ser registrada (em `STACK.md`, ADR ou aqui).
- **Segurança entra no critério de aceite**, não depois. Toda issue de rota nova
  traz o teste de acesso cruzado entre lojas.

## Sprints

| Sprint | Objetivo |
| --- | --- |
| 00 - Fundação e publicação | Etapas 1 e 2a entregues; CI verde, Dockerfile, proteção de branch, secrets e as decisões que destravam o resto |
| 01 - Convites, equipe e lojas | Etapa 2b |
| 02 - Administração da plataforma | Etapa 2c |
| 03 - Catálogo e estoque | Etapa 3 |
| 04 - Clientes e consignação | Etapa 4 |
| 05 - Leilões e bot | Etapa 5, incluindo o `whatsapp_microservice` |
| 06 - Acertos, envios e páginas públicas | Etapa 6 |
| 07 - Painéis | Etapa 7 |
| 08 - Vitrine, planos e perfil | Etapa 8 |

O `frontend_web` entra depois que o design estiver pronto (issue de bootstrap
bloqueada na Sprint 00); as telas de cada sprint são feitas a partir do design.

## Rótulos

| Grupo | Rótulos |
| --- | --- |
| Tipo | `feature`, `bug`, `chore`, `tech-debt`, `security`, `epic` |
| Situação | `decisao-pendente` (decide o dono do produto), `acao-do-dono` (só quem administra o repositório faz: interface do GitHub, contas, secrets), `bloqueada` |
| Prioridade | `p1-alta`, `p2-media`, `p3-baixa` |
| Tamanho | `tamanho:P` (até meio dia), `tamanho:M` (cerca de 1 dia), `tamanho:G` (2 dias ou mais; quebrar) |
| Área | `area:auth`, `area:db`, `area:api`, `area:admin`, `area:inventory`, `area:customers`, `area:auctions`, `area:bot`, `area:public`, `area:finance`, `area:infra`, `area:docs`, `area:frontend` |

## Ciclo de uma sprint

1. **Planejar.** O agente propõe o conteúdo a partir do roadmap e do que ficou da
   sprint anterior; o dono aprova, corta ou reordena. Issue `decisao-pendente`
   da sprint é resolvida **primeiro**.
2. **Executar.** Uma branch por issue (ou por grupo coeso), nome
   `feature/<slug>`, `fix/<slug>` etc. Commits em Conventional Commits. Cada
   issue andando recebe um comentário curto quando começa e quando termina, com
   o link do commit ou do PR.
3. **Entregar.** PR com título em Conventional Commits e `Closes #N`. Abre em
   **rascunho** e sai do rascunho quando o `ci-success` está verde. Merge por
   squash, com aprovação de CODEOWNER.
4. **Encerrar.** Ao fim: o que entrou, o que sobrou (volta para o milestone
   seguinte, com motivo), o que mudou no plano. O milestone é fechado. Mudança
   de escopo vira atualização no roadmap, no mesmo PR.

## O que o agente pode e não pode fazer

| Pode, sem perguntar | Precisa de aprovação |
| --- | --- |
| Criar e atualizar issues, rótulos e milestones | Fazer **merge** de qualquer PR |
| Dar `push` em branches de trabalho e abrir PR em rascunho | `push` direto na branch padrão ou em branch protegida; `push --force` |
| Comentar e fechar issue que um PR concluiu | Criar secrets, mexer em proteção de branch, Environments e permissões |
| Rodar o CI e corrigir o que ele aponta | Mudar workflows (`.github/workflows/**`) |
| Atualizar documentação junto com o código | Deploy em `homolog` ou `prod`; qualquer coisa com dado real de usuário |

Autorizado pelo dono em 2026-10-17: `push` de branches de trabalho, criação de
issues, rótulos e milestones, e abertura de PR em rascunho.

## Definição de pronto

A de cada repositório, no `AGENTS.md` (seção 5). Para o Backend: `make validate`,
teste novo, migration com `up` e `down`, `schema.ts` e seed atualizados, contrato
regenerado, teste de acesso cruzado em rota nova, documentação ao dia.

## Observações

- O quadro do **GitHub Projects** não foi criado: exige o escopo `project` no
  token do `gh` (`gh auth refresh -s project`, que abre o navegador). Enquanto
  isso, milestones e rótulos fazem o papel. O workflow `github-agent.yml` já
  adiciona issues ao Project quando `PROJECT_URL` e `AUTOMATION_TOKEN` existirem.
- Milestones são por repositório. Uma entrega que cruza repositórios (ex.: o
  bot na Sprint 05) tem uma issue em cada um, ligadas por menção (`#N` e
  `org/repo#N`).
