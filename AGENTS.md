# AGENTS.md

## Leia primeiro: OWNER.md

[`OWNER.md`](OWNER.md) é o canal entre o agente e o dono. **No início de cada sessão, leia-o.**
Se um item dele bloqueia a tarefa, pare e avise. Tudo que depender do dono (decisão, conta,
secret, proteção de branch) é **escrito lá**, não só numa issue ou na conversa.

## O que é este repositório

`Project-PKA/shared` é o `docs/shared` do **pokemonAuction** (nome
provisório): uma plataforma SaaS B2B de leilões de cartas TCG via WhatsApp.
Aqui vive o que atravessa mais de um repositório e não pertence a nenhum
isoladamente. Não roda código de aplicação e não tem deploy.

Repositórios do projeto: `Project-PKA/Backend`, `Project-PKA/frontend_web`,
`Project-PKA/whatsapp_microservice` e este.

## Estrutura

- [`openapi.yaml`](openapi.yaml): contrato de API. É **gerado pelo Backend**
  (`make openapi`) e chega aqui por PR aberto pelo workflow
  `publish-contract.yml` do Backend. Não o edite à mão aqui; mude o código
  do Backend.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): como os repositórios se conectam,
  autenticação entre serviços, diagrama C4 e riscos aceitos.
- [`docs/adr/`](docs/adr/): decisões que afetam mais de um repositório.
- [`OWNER.md`](OWNER.md): canal do dono (decisões e ações pendentes, resolvidos).
- [`docs/produto.md`](docs/produto.md): escopo de produto (papéis, regras de
  negócio vigentes e mapa de telas).
- [`docs/processo.md`](docs/processo.md): issues, sprints e rótulos (vale para os
  quatro repositórios).
- [`GLOSSARY.md`](GLOSSARY.md): vocabulário de domínio.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): como propor mudanças.

## Se você é um agente de IA em OUTRO repositório do projeto

Antes de tomar decisão de arquitetura ou de contrato de API, faça nesta
ordem:

1. Leia [`ARCHITECTURE.md`](ARCHITECTURE.md) para saber onde o repositório
   atual se encaixa.
2. Leia [`openapi.yaml`](openapi.yaml) antes de implementar ou consumir
   qualquer endpoint.
3. Consulte [`docs/adr/`](docs/adr/) para decisões já tomadas ou descartadas.
4. Use os termos de [`GLOSSARY.md`](GLOSSARY.md) para nomear campos,
   endpoints, eventos e variáveis. Não invente sinônimos.

Se uma decisão cross-repo for necessária e não estiver documentada aqui,
**sinalize ao humano** em vez de decidir dentro do repositório individual.
Essas decisões pertencem a este repositório, via issue e ADR
(`CONTRIBUTING.md`).

## Regras ao mexer aqui

- Decisão cross-repo = ADR nova em `docs/adr/` (próximo número, sem reuso),
  seguindo o modelo da ADR 0001. ADR aceita não se edita: cria-se outra que a
  supera.
- Termo de negócio novo que aparece em mais de um repositório entra no
  `GLOSSARY.md` no mesmo PR.
- Branches e commits seguem Conventional Commits (`docs: ...`,
  `docs/nome-curto`).
- **Pare e pergunte** antes de: mudar contrato de forma incompatível,
  alterar `.github/workflows/**`, alterar `CODEOWNERS`, ou reabrir uma ADR
  aceita.

## Pendências conhecidas

Marcadas como `PENDENTE` ou `A DECIDIR` nas ADRs e no `ARCHITECTURE.md`:
provedor
de e-mail do OTP, estratégia de concorrência de lances, LGPD, canal de aviso
em tempo real do painel, cobrança da assinatura da plataforma, armazenamento de
arquivos (fotos, avatar, comprovante) e como "Avisar cliente no WhatsApp"
envia a mensagem. Detalhes em `docs/produto.md`, seção 6.
