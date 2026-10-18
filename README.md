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
| [`docs/adr/`](docs/adr/) | Decisões que afetam mais de um repositório (ADRs 0001 a 0014) |
| [`GLOSSARY.md`](GLOSSARY.md) | Vocabulário de negócio, com o nome de cada termo no código |
| [`openapi.yaml`](openapi.yaml) | Contrato de API, **gerado pelo Backend** e publicado aqui por PR |
| [`docs/secrets.md`](docs/secrets.md) | Nome do secret deste repositório |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Como propor mudanças |
| [`AGENTS.md`](AGENTS.md) | Contexto para agentes de IA |

## Repositórios do projeto

| Repositório | Papel |
| --- | --- |
| [`Backend`](https://github.com/Project-PKA/Backend) | API e dono do schema do banco |
| [`whatsapp_microservice`](https://github.com/Project-PKA/whatsapp_microservice) | Sessões de WhatsApp, leitura de lances e moderação do grupo |
| [`frontend_web`](https://github.com/Project-PKA/frontend_web) | Painel do lojista e landing page (UI/UX em andamento) |
| **shared** (este) | Contrato, ADRs e glossário |

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
