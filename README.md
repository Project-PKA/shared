# pokemonAuction · shared

> Nome do produto provisório. Este é o `docs/shared` do projeto: o que é
> **compartilhado entre todos os repositórios** e não pertence a nenhum deles.

O pokemonAuction é um SaaS B2B multi-tenant para lojistas de Trading Card
Games fazerem leilões de cartas em grupos de WhatsApp. Este repositório **não
roda código de aplicação** e não tem deploy. Ele guarda:

| Arquivo | O que é |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Como os repositórios se conectam, diagrama C4, autenticação entre serviços e riscos aceitos |
| [`docs/adr/`](docs/adr/) | Decisões que afetam mais de um repositório (ADRs 0001 a 0010) |
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

## Pendências de configuração manual (GitHub)

Estes passos não podem ser feitos por commit:

- [ ] **Branch protection em `main`** (Settings → Branches): exigir PR antes de
      merge e exigir que `validate-openapi.yml` passe.
- [ ] **`CODEOWNERS`** ainda tem placeholders (`SUA-ORG/...`): trocar por
      usuários ou times reais com acesso de escrita, e ativar "Require review
      from Code Owners".
- [ ] **Secret `CONTRACT_DISPATCH_TOKEN`** (ver [`docs/secrets.md`](docs/secrets.md)),
      necessário só quando o `frontend_web` tiver o workflow que escuta o evento
      `openapi-contract-updated` (exemplo no fim de `notify-consumers.yml`). Sem
      o secret, o workflow falha ao tentar notificar.
- [ ] Se este repositório ainda estiver marcado como **Template repository**
      (Settings → General), desmarque: ele agora é o `shared` de um projeto real.
