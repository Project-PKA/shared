# AGENTS.md

## Este é um repositório TEMPLATE

Este repositório (`docs/shared`) é um **template do GitHub**. Ele não
representa, por si só, um projeto real — ele é copiado ("Use this
template") para criar o `docs/shared` de cada projeto que tenha mais de um
repositório (backend, frontend, microservices).

## Se você é um agente de IA operando neste repositório agora

1. **Se existir um `BOOTSTRAP.md` na raiz deste repositório**, leia e siga
   ele antes de qualquer outra coisa. Ele contém um roteiro de entrevista
   que precisa ser concluído com o humano responsável antes que qualquer
   conteúdo real (`ARCHITECTURE.md`, `GLOSSARY.md`, etc.) seja gerado. Não
   pule etapas do `BOOTSTRAP.md` mesmo que pareça óbvio o que preencher.

2. **Se `BOOTSTRAP.md` não existir mais** (já foi apagado ao final do
   setup inicial), este repositório está em operação normal. Siga a
   estrutura abaixo.

## Estrutura normal (pós-bootstrap)

Este repositório contém o que é compartilhado entre todos os repositórios
do projeto e não pertence a nenhum isoladamente:

- [`openapi.yaml`](openapi.yaml) — contrato de API único entre backend e
  frontend. Fonte única de verdade.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — arquitetura do sistema como um
  todo: como os repositórios se conectam, autenticação entre serviços,
  diagrama de contexto.
- [`docs/adr/`](docs/adr/) — decisões de arquitetura que afetam mais de um
  repositório.
- [`GLOSSARY.md`](GLOSSARY.md) — vocabulário de domínio/negócio
  compartilhado.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — como propor mudanças nos itens
  acima, válido para todos os repositórios do projeto.

Mudanças aqui seguem o processo em [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Se você é um agente de IA operando em OUTRO repositório do projeto (backend, frontend, microservice)

Este repositório (`docs/shared`) é a **referência** para os demais
repositórios do projeto. Antes de tomar qualquer decisão de arquitetura ou
de contrato de API dentro de um repositório individual, um agente deve:

1. Ler [`ARCHITECTURE.md`](ARCHITECTURE.md) deste repositório para entender
   como o sistema como um todo se conecta e onde o repositório atual se
   encaixa.
2. Ler [`openapi.yaml`](openapi.yaml) antes de implementar ou consumir
   qualquer endpoint — não confiar apenas no que já existe implementado
   localmente, o contrato aqui é a fonte de verdade.
3. Consultar [`docs/adr/`](docs/adr/) para decisões cross-repo já tomadas,
   antes de propor algo que talvez já tenha sido decidido (ou descartado)
   anteriormente.
4. Usar os termos definidos em [`GLOSSARY.md`](GLOSSARY.md) ao nomear
   campos, endpoints, eventos ou variáveis que representem conceitos de
   domínio — não inventar sinônimos.

Se uma decisão de arquitetura ou de contrato de API for necessária e ainda
não estiver documentada aqui, o agente deve sinalizar isso ao humano em vez
de decidir unilateralmente dentro do repositório individual — essas
decisões pertencem a este repositório (`docs/shared`), via issue e ADR,
conforme [`CONTRIBUTING.md`](CONTRIBUTING.md).
