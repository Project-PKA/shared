# docs/shared (template)

Template de repositório para o que é **compartilhado entre todos os
repositórios de um projeto** (backend, frontend e, quando existirem,
microservices) e não pertence a nenhum deles isoladamente:

- o contrato de API (`openapi.yaml`),
- a arquitetura do sistema como um todo (`ARCHITECTURE.md`, `docs/adr/`),
- o vocabulário de domínio/negócio (`GLOSSARY.md`).

Este repositório **não roda código de aplicação** — não há deploy aqui.
As únicas automações são: validar que a documentação está bem formada
(`validate-openapi.yml`) e, opcionalmente, notificar outros repositórios
quando o contrato de API muda (`notify-consumers.yml`).

## Como criar um projeto real a partir deste template

No GitHub, use o botão **"Use this template"** nesta página do repositório
— **não faça fork**. Fork mantém um vínculo de histórico com este template
que não faz sentido aqui; "Use this template" cria um repositório novo e
independente, que é o que cada projeto precisa.

Depois de criar o repositório:

1. Ele terá um `BOOTSTRAP.md` na raiz. Siga o roteiro descrito nele — é uma
   entrevista curta (nome do projeto, quais repositórios vão consumir este
   `docs/shared`, termos de domínio) que precisa ser respondida antes de
   qualquer conteúdo real ser gerado.
2. Ao final do `BOOTSTRAP.md`, ele mesmo é apagado — isso marca o fim do
   setup inicial.
3. Complete o checklist de configuração manual abaixo (não é feito pelo
   `BOOTSTRAP.md`, precisa da interface do GitHub).

## Como os outros repositórios do projeto devem referenciar este

- **Contrato de API:** o backend implementa e o frontend consome a partir
  de `openapi.yaml` deste repositório — não copiar o arquivo, referenciar
  a versão publicada aqui (ex.: via submodule, download no CI, ou pacote
  publicado a partir deste contrato, conforme o projeto decidir).
- **Arquitetura:** qualquer decisão de arquitetura que atravesse mais de um
  repositório é discutida e registrada aqui (`docs/adr/`), não em um dos
  repositórios individuais.
- **Agentes de IA:** qualquer agente operando em outro repositório do
  projeto deve ler `ARCHITECTURE.md`, `openapi.yaml`, `docs/adr/` e
  `GLOSSARY.md` deste repositório antes de decisões de arquitetura ou de
  contrato — ver [`AGENTS.md`](AGENTS.md).
- **Notificação automática:** quando `openapi.yaml` muda na branch
  principal deste repositório, `notify-consumers.yml` dispara um evento
  `repository_dispatch` para os repositórios configurados nele, para que
  possam reagir (ex.: regenerar types).

## Checklist de configuração manual (GitHub, feito uma vez, por template ou por projeto)

Estes passos não podem ser automatizados por commit — são feitos na
interface do GitHub:

- [ ] **Marcar este repositório como Template Repository**
      (Settings → General → Template repository).
- [ ] **Branch de proteção da branch principal** (Settings → Branches):
      exigir PR antes de merge, exigir que `validate-openapi.yml` passe.
- [ ] **Times/usuários referenciados em [`CODEOWNERS`](.github/CODEOWNERS)**
      precisam existir na organização e ter acesso de escrita ao
      repositório antes do CODEOWNERS funcionar.
- [ ] **Ativar "Require review from Code Owners"** na proteção de branch,
      para que o `CODEOWNERS` seja de fato obrigatório.

### Ao criar um projeto real a partir deste template

- [ ] Criar o secret `CONTRACT_DISPATCH_TOKEN` neste novo repositório
      (Settings → Secrets and variables → Actions), com um token (PAT
      fine-grained ou GitHub App) com permissão de disparar eventos nos
      repositórios de destino configurados em
      [`notify-consumers.yml`](.github/workflows/notify-consumers.yml).
      **Sem esse secret, `notify-consumers.yml` falha silenciosamente ao
      tentar notificar os outros repositórios.**
- [ ] Confirmar que os repositórios de destino (backend, frontend,
      microservices) têm um workflow ouvindo o evento
      `repository_dispatch` do tipo `openapi-contract-updated` (exemplo
      comentado no final de `notify-consumers.yml`).
