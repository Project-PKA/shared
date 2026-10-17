# 1. Registro de decisões de arquitetura centralizado

Data: 2026-10-17

## Status

Aceita

## Contexto

Este projeto é composto por múltiplos repositórios (backend, frontend e,
possivelmente, microservices). Decisões de arquitetura que afetam **apenas
um** repositório podem e devem ser registradas dentro dele. Mas decisões que
afetam **mais de um repositório** — contrato de API, autenticação entre
serviços, escolha de protocolo de comunicação, formato de eventos, etc. —
não têm um lugar natural em nenhum repositório individual, e historicamente
tendem a ficar perdidas em threads de chat, PRs isolados ou na memória de
quem participou da decisão.

## Decisão

Toda ADR (Architecture Decision Record) que afeta mais de um repositório
deste projeto é registrada neste repositório (`docs/shared`), em
`docs/adr/`, seguindo o formato deste documento.

Decisões que afetam apenas um repositório continuam registradas no
`docs/adr/` local daquele repositório, se ele tiver um.

### Convenção de nomenclatura

```
docs/adr/NNNN-titulo-curto-em-kebab-case.md
```

Onde `NNNN` é um número sequencial de 4 dígitos, sem reuso mesmo que uma ADR
seja depois superada (uma ADR superada ganha uma nova ADR que a substitui e
é marcada como tal — ver seção "Status" abaixo).

### Template para novas ADRs

```markdown
# NNNN. [Título da decisão]

Data: YYYY-MM-DD

## Status

[Proposta | Aceita | Superada por NNNN | Depreciada]

## Contexto

[Qual problema ou força motivadora exige uma decisão? Quais repositórios
são afetados?]

## Decisão

[O que foi decidido, de forma direta e verificável.]

## Consequências

[O que fica mais fácil ou mais difícil a partir desta decisão. Trade-offs
aceitos conscientemente.]
```

## Consequências

- Qualquer pessoa (ou agente de IA) trabalhando em qualquer repositório
  deste projeto sabe onde procurar o histórico de decisões cross-repo: aqui.
- PRs que proponham uma decisão cross-repo devem incluir uma ADR nova ou
  referenciar uma existente.
- Este repositório se torna dependência de leitura (não de build) dos
  demais — ver [`AGENTS.md`](../../AGENTS.md) e [`ARCHITECTURE.md`](../../ARCHITECTURE.md).
