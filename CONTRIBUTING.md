# Contribuindo com `docs/shared`

Este documento vale para **todos os repositórios do projeto** que apontam
para este repositório como fonte compartilhada (backend, frontend e
microservices). Não é necessário duplicar um `CONTRIBUTING.md` local sobre
como mudar contrato de API ou arquitetura — este arquivo é a referência.

## O que vive aqui

- `openapi.yaml` — contrato de API único entre backend e frontend.
- `ARCHITECTURE.md` — arquitetura do sistema como um todo (cross-repo).
- `docs/adr/` — decisões de arquitetura que afetam mais de um repositório.
- `GLOSSARY.md` — vocabulário de domínio/negócio compartilhado.

O que **não** vive aqui: código de aplicação, configuração de deploy,
segredos, ou documentação interna de um único repositório (essa fica no
`ARCHITECTURE.md`/`docs/adr/` local daquele repositório, se existir).

## Mudando o contrato de API (`openapi.yaml`)

1. Abra uma issue usando o template **"Mudança de contrato de API"**
   descrevendo o que muda e por quê.
2. Abra um PR alterando `openapi.yaml`. O workflow `validate-openapi.yml`
   valida automaticamente que o documento continua um OpenAPI válido.
3. Ao mergear na branch principal, o workflow `notify-consumers.yml`
   dispara um evento para os repositórios consumidores configurados, para
   que eles possam regenerar types/clients a partir do contrato atualizado.
4. Repositórios consumidores não devem editar o contrato localmente — toda
   mudança de contrato entra por aqui primeiro.

## Propondo uma decisão de arquitetura cross-repo

1. Abra uma issue usando o template **"Decisão de arquitetura a
   discutir"**.
2. Depois de discutida e decidida, registre-a como uma ADR nova em
   `docs/adr/`, seguindo o template em
   [`0001-registro-de-decisoes.md`](docs/adr/0001-registro-de-decisoes.md).
3. Abra um PR com a ADR. Ela precisa ser revisada por quem consta em
   [`CODEOWNERS`](.github/CODEOWNERS) antes do merge.

## Atualizando o glossário

Qualquer pessoa pode propor um termo novo ou uma correção via PR direto em
`GLOSSARY.md`. Não é necessário passar por issue para isso, a menos que o
termo seja controverso ou ambíguo entre repositórios — nesse caso, use o
template de decisão de arquitetura.

## Revisão

Todo PR neste repositório passa pelos donos definidos em
[`CODEOWNERS`](.github/CODEOWNERS). Mudanças em `openapi.yaml` têm impacto
direto em outros repositórios — trate como uma mudança pública de API, não
como um ajuste interno de documentação.

## Dúvidas

Se um agente de IA (assistente de código) estiver operando em qualquer
repositório deste projeto, ele deve ler este repositório antes de tomar
decisões de arquitetura ou de contrato de API — ver
[`AGENTS.md`](AGENTS.md).
