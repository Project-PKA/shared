# pokemonAuction · shared

> Nome do produto provisório. Este é o `docs/shared` do projeto: o que é
> **compartilhado entre todos os repositórios** e não pertence a nenhum deles.

O pokemonAuction é um SaaS B2B multi-tenant para lojistas de Trading Card
Games fazerem leilões de cartas em grupos de WhatsApp. Este repositório **não
roda código de aplicação** e não tem deploy. Ele guarda:

| Arquivo | O que é |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Como os repositórios se conectam, diagrama C4, autenticação entre serviços e riscos aceitos |
| [`OWNER.md`](OWNER.md) | **Canal do dono**: decisões e ações que dependem dele, e o que já foi resolvido |
| [`docs/produto.md`](docs/produto.md) | Escopo de produto: papéis, regras e mapa de telas (doc 01 + adendo do design) |
| [`docs/processo.md`](docs/processo.md) | Issues, sprints, rótulos e o que o agente pode fazer sozinho |
| [`docs/adr/`](docs/adr/) | Decisões que afetam mais de um repositório (ADRs 0001 a 0017) |
| [`GLOSSARY.md`](GLOSSARY.md) | Vocabulário de negócio, com o nome de cada termo no código |
| [`openapi.yaml`](openapi.yaml) | Contrato de API, **gerado pelo Backend** e publicado aqui por PR |
| [`docs/secrets.md`](docs/secrets.md) | Nome do secret deste repositório |
| [`compose.yaml`](compose.yaml) | **Ambiente local completo** (banco, Redis, e-mail, API e frontend) para testar tudo junto (inclui o bot, em perfil à parte), ver abaixo |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Como propor mudanças |
| [`AGENTS.md`](AGENTS.md) | Contexto para agentes de IA |

## Repositórios do projeto

| Repositório | Papel |
| --- | --- |
| [`Backend`](https://github.com/Project-PKA/Backend) | API e dono do schema do banco |
| [`whatsapp_microservice`](https://github.com/Project-PKA/whatsapp_microservice) | Sessões de WhatsApp, leitura de lances e moderação do grupo |
| [`frontend_web`](https://github.com/Project-PKA/frontend_web) | Painel do lojista e landing page (UI/UX em andamento) |
| **shared** (este) | Contrato, ADRs e glossário |

## Rodar tudo localmente

Com `Backend`, `frontend_web` e `shared` clonados lado a lado e o Docker ligado:

```bash
docker compose up -d --build        # banco, Redis, Mailpit, API e frontend
docker compose run --rm seed        # dados de exemplo (apaga o banco; só desenvolvimento)
```

Abra o frontend em http://localhost:3000. O login é por código enviado ao e-mail: peça o código na
tela e leia-o no Mailpit, em http://localhost:8025 (nada sai da sua máquina). Contas do seed:
`dono@example.com`, `funcionario@example.com` e `admin@example.com`. A API fica em
http://localhost:8081 (a 8080 é deixada livre) e as fotos e comprovantes ficam no volume
`storage_data`. Para ser administrador da plataforma:
`docker compose run --rm create-admin voce@exemplo.com "Seu Nome"`.

`docker compose down` desliga e mantém os dados; `docker compose down -v` apaga tudo. O bot de WhatsApp
só sobe com `docker compose --profile bot up -d --build` e, sem conta pareada (falta o gatilho do painel, OWNER.md D20), apenas fica de pé em http://localhost:8082/health. Portas e detalhes: `compose.yaml` e `.env.example`.

**Teste de integração entre os serviços** (API, banco, e-mail, frontend e bot), com o ambiente de pé e o seed aplicado:

```bash
node scripts/smoke.mjs
```

Para testar sem tocar no seu ambiente, suba um segundo com outro nome e outras portas (`docker compose -p itest --env-file itest.env up -d --build`, com `WEB_PORT`, `API_PORT`, `MAILPIT_*`, `DB_PORT`, `REDIS_PORT` e `BOT_PORT` diferentes) e aponte o script com `API_URL`, `WEB_URL`, `MAILPIT_URL`, `BOT_URL` e `COMPOSE_PROJECT`. Para testar outra cópia do código (um `git worktree`), use `BACKEND_DIR`, `WEB_DIR` e `BOT_DIR`.

## Como os outros repositórios usam este

- **Contrato de API:** o Backend gera o `openapi.yaml` a partir do código e
  abre um PR aqui. O frontend consome a versão publicada aqui, nunca uma cópia.
  Não edite o `openapi.yaml` à mão neste repositório.
- **Arquitetura:** decisão que atravessa mais de um repositório é discutida e
  registrada aqui (`docs/adr/`), não em um repositório individual.
- **Agentes de IA:** antes de decisão de arquitetura ou de contrato, leia
  `ARCHITECTURE.md`, `openapi.yaml`, `docs/adr/` e `GLOSSARY.md` daqui. Veja
  [`AGENTS.md`](AGENTS.md).
- **Notificação automática:** quando `openapi.yaml` muda em `main`,
  `notify-consumers.yml` avisa os consumidores (hoje, o `frontend_web`) por
  `repository_dispatch`.

## Pendências do dono

Tudo que só o dono pode decidir ou fazer (conta, secrets, proteção de branch, decisões de
produto) está em [`OWNER.md`](OWNER.md), o **canal principal** entre o agente e o dono.
Este repositório não deve mais ser marcado como *Template repository*.
