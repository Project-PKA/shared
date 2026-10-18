# OWNER: o canal entre o agente e o dono

> **Última atualização:** 2026-10-17 · **Dono:** @IgorOCosta

Este arquivo é o **canal principal** entre o agente e o dono do produto. Tudo que só
o dono pode decidir ou fazer fica aqui.

## Como usar

1. O **agente escreve aqui** o que depende do dono: decisão, ação em conta ou no GitHub,
   revisão. Cada item diz o que trava, o que o agente recomenda e onde está a issue.
2. O **dono responde direto neste arquivo** (campo "Resposta"), por PR ou por comentário.
   Uma linha basta: `D3: disco da VPS`.
3. **No início de cada sessão o agente lê este arquivo.** Se um item daqui bloqueia a
   tarefa, ele para e avisa, em vez de escolher por conta própria.
4. Item resolvido vai para "Resolvidos", com a data. As issues do GitHub continuam como
   registro e histórico (os links estão nas tabelas), mas **este arquivo manda**.

## Para decidir

Prioridade de cima para baixo. "Trava" diz o que não anda sem a resposta.

| ID | Decisão | Trava | Recomendação do agente | Issue | Resposta do dono |
| --- | --- | --- | --- | --- | --- |
| D1 | **Provedor de e-mail** (OTP e convites) | Deploy em `homolog` e `prod`: a API se recusa a subir com o provedor `log`. **Não trava** o desenvolvimento | Um provedor com domínio próprio (SPF e DKIM). Resend é o mais simples para começar; SES sai mais barato em volume | [Backend#9](https://github.com/Project-PKA/Backend/issues/9) | _Adiada: ainda não há provedor (2026-10-17)_ |
| D2 | **LGPD**: retenção e exclusão de dados pessoais, base legal e texto de consentimento | Sprints 04 e 06 (clientes, página de acerto). Também decide se "excluir loja" existe | Revisão por profissional jurídico antes de qualquer loja real. Posso preparar um rascunho técnico (o que guardamos, onde, por quanto tempo) para ele revisar | [shared#3](https://github.com/Project-PKA/shared/issues/3) | _aguardando_ |
| D3 | **Armazenamento de arquivos** (fotos de carta, avatar, comprovante) | Sprint 03 (fotos), 06 (comprovante) e 08 (avatar) | Disco da VPS com backup no início; bucket compatível com S3 quando crescer | [Backend#10](https://github.com/Project-PKA/Backend/issues/10) | _aguardando_ |
| D4 | **Segundo fator** para o administrador da plataforma | Produção (a conta mais valiosa do sistema) | Decidir antes de produção. Opção mínima: sessão curta e reautenticação por OTP em ação sensível | [Backend#11](https://github.com/Project-PKA/Backend/issues/11) | _aguardando_ |
| D5 | **Licença do catálogo** e uso da arte e dos nomes das cartas | Publicar a vitrine pública (Sprint 08) | **Pesquisado (2026-10-17):** o repositório do catálogo (TCGdex) é **MIT**, mas não declara licença para as **imagens**, e o projeto avisa que não é afiliado à Nintendo nem à The Pokémon Company. Recomendo: usar o texto e os números do catálogo; **não copiar as imagens** (apontar para o endereço de origem, `assets.tcgdex.net`); pôr nos Termos e no rodapé que o produto não é afiliado nem endossado pelas marcas; e consultar um profissional sobre uso de marca na vitrine pública | [shared#6](https://github.com/Project-PKA/shared/issues/6) | _aguardando_ |
| D6 | **Cobrança da assinatura** da plataforma | Tela de Plano (Sprint 08) | Manual no MVP (fatura externa), como o "solicitar mudança de plano" do design indica | [shared#4](https://github.com/Project-PKA/shared/issues/4) | _aguardando_ |
| D7 | Como **"Avisar cliente no WhatsApp"** (Envios) envia a mensagem | Sprint 06 | Link `wa.me` aberto pela loja, coerente com a ADR 0006 (o bot não manda mensagem privada) | [shared#5](https://github.com/Project-PKA/shared/issues/5) | _aguardando_ |
| D8 | **Revisão por CODEOWNER com uma pessoa só** | Merge de qualquer PR, se a proteção exigir | **Não exigir** aprovação de CODEOWNER enquanto você for o único: o autor não aprova o próprio PR e nada mergearia. Exigir só o `ci-success` (Backend) e a validação do contrato (shared). Quando entrar a segunda pessoa, ligar a exigência | — | _aguardando_ |
| D9 | **Merge da pilha de PRs** | Entrega da Etapa 2 | Os PRs do Backend estão empilhados (#66, #67, #69, #70). Se você mergear por **squash**, o PR seguinte volta a mostrar as mudanças anteriores. Opções: (a) mergear por **merge commit** ou **rebase**; (b) mergear por squash e me autorizar a **rebasear o próximo PR em `main` com `push --force-with-lease`** na branch dele, a cada merge | — | _aguardando_ |
| D11 | **Onde mora a regra de lance** (consequência do bot em Python) | Sprint 05 (motor de lances) | Já decidi, reversível ([ADR 0016](docs/adr/0016-decisao-de-lance-em-funcao-do-banco.md)): uma função `place_bid` no Postgres, com trava da linha do leilão, chamada pelo Backend e pelo bot. Alternativa: o bot chamar um endpoint interno do Backend. Diga se prefere a outra | — | _decisão do agente, **já implementada** (migration 0013 do Backend); ainda reversível, aguardando ok_ |
| D13 | **Aprovar o desenho das páginas públicas** (papel `public_runtime` e funções `SECURITY DEFINER`) | Sprint 06: acerto do cliente (#52), consignador (#56), vitrine | Por regra do projeto, papel de banco e função `SECURITY DEFINER` pública precisam do seu ok antes de eu escrever. Proposta ([ADR 0014](docs/adr/0014-paginas-publicas-por-link-e-vitrine.md)): papel `NOLOGIN` `public_runtime` **sem acesso a nenhuma tabela**, só `EXECUTE` em funções com `search_path` fixo; cada função recebe o token (hash comparado no banco), devolve só os campos permitidos e responde igual para token inválido, expirado ou revogado; tentativas erradas contadas por link e por IP com bloqueio temporário; o `place_bid`-like nunca é exposto. Diga **sim** (ou o que mudar) e eu implemento #57, #52, #56 e #58. O comprovante (#53) segue travado pela D3 | #52, #53, #56, #57, #58 | _aguardando_ |
| D10 | **Nome do produto** (hoje `pokemonAuction`, provisório) | Nada trava; a troca fica mais cara quanto mais tarde | Decidir antes do primeiro deploy: o nome aparece no README, nos docs, no `issuer` do JWT, no nome da imagem e na landing | — | _aguardando_ |

## Para fazer no GitHub e em contas

Só você consegue. O agente não cria secrets, não mexe em proteção de branch nem em Environments.

| ID | Ação | Quando | Passo a passo | Issue |
| --- | --- | --- | --- | --- |
| A1 | **Proteção de branch** em `main` (Backend e shared) | Antes de ter mais de uma pessoa, ou quando quiser travar o `main` | Settings, Branches, Add rule em `main`: exigir PR e o check `ci-success` (Backend) ou `Lint com Spectral` (shared). **Sem** "Require review from Code Owners" (ver D8). Detalhes em `Backend/SETUP-GITHUB.md`, B3 | [Backend#5](https://github.com/Project-PKA/Backend/issues/5), [shared#1](https://github.com/Project-PKA/shared/issues/1) |
| A2 | **`AUTOMATION_TOKEN`** e variables | Para publicar o contrato no shared por PR, abrir PR de release e usar o agente do GitHub | Criar um PAT fine-grained com acesso aos 4 repositórios (contents, pull requests, issues, projects) e cadastrar como secret `AUTOMATION_TOKEN`. Variables: `CONTRACT_REPO=Project-PKA/shared`, `CODEQL_LANGUAGES=javascript-typescript`, `PROJECT_URL` (se criar o Projects) | [shared#2](https://github.com/Project-PKA/shared/issues/2) |
| A3 | **Environments** `dev`, `test`, `homolog` (com aprovação) e `prod` (com aprovação) | Quando existir VPS e deploy | `Backend/SETUP-GITHUB.md`, B4. Os nomes dos secrets estão em `Backend/docs/secrets.md` | [Backend#5](https://github.com/Project-PKA/Backend/issues/5) |
| A4 | **SonarCloud** (hoje **desligado**) | Quando quiser a análise de qualidade e o Quality Gate | Criar o projeto no SonarCloud, gerar o token e cadastrar o secret `SONAR_TOKEN`; preencher `sonar.organization` e `sonar.projectKey` em `Backend/sonar-project.properties`; remover `sonar: false` do `ci.yml`; desligar a "Automatic Analysis" no SonarCloud | [Backend#6](https://github.com/Project-PKA/Backend/issues/6) |
| A5 | **Secret scanning** e **push protection** | Já | Settings, Code security, ativar nos 4 repositórios (`SETUP-GITHUB.md`, A4) | [Backend#5](https://github.com/Project-PKA/Backend/issues/5) |
| A6 | **Revisar e mergear os PRs** | Quando quiser entregar | Ordem: Backend #66, #67, #69, #70 (de baixo para cima) · shared #7 · bot #6 fica em rascunho até o bootstrap do bot. Atenção ao D9 | ver abaixo |
| A9 | **Conta de WhatsApp para testar o bot** | Toda a implementação do bot (Sprint 05). Sem ela, o bot só avança com eventos simulados | Um número dedicado a teste (chip pré-pago serve) e um grupo de teste onde ele seja administrador. Nunca usar o número da loja real para teste | [whatsapp_microservice#1](https://github.com/Project-PKA/whatsapp_microservice/issues/1) |
| A7 | **VPS e domínio** | Para qualquer deploy | Contratar a VPS e registrar o domínio. Ver `Backend/DEPLOY.md` (requisitos de segurança) | — |
| A8 | **Quadro do GitHub Projects** (opcional) | Se quiser o quadro | Rode `gh auth refresh -s project` (abre o navegador) e me avise; eu crio o quadro. Os milestones já fazem o papel | — |

### PRs abertos

| Repositório | PR | O que é |
| --- | --- | --- |
| Backend | [#66](https://github.com/Project-PKA/Backend/pull/66) | Etapas 1 e 2a: scaffold, schema, RLS, login por convite |
| Backend | [#67](https://github.com/Project-PKA/Backend/pull/67) | Etapa 2b: lojas, equipe, convites, log de atividades |
| Backend | [#69](https://github.com/Project-PKA/Backend/pull/69) | Dockerfile |
| Backend | [#70](https://github.com/Project-PKA/Backend/pull/70) | Sonar desligado e `CODEOWNERS` |
| shared | [#7](https://github.com/Project-PKA/shared/pull/7) | Produto, ADRs 0002 a 0014, processo e este canal |
| frontend_web | [#6](https://github.com/Project-PKA/frontend_web/pull/6) | Registra o protótipo de UI/UX (`design/`), copiado sem alteração. CI vermelho por ser template |
| whatsapp_microservice | [#6](https://github.com/Project-PKA/whatsapp_microservice/pull/6) | Só documentação; CI vermelho até o bootstrap do bot |

## Resolvidos

| Data | Item | Como |
| --- | --- | --- |
| 2026-10-17 | Branch padrão do Backend e do frontend | Renomeada para `main`; PRs e clones atualizados |
| 2026-10-17 | Workflows centrais vazios | Publicados em `IgorOCosta/workflows`; tag `v1` criada. Primeiro CI do Backend passou em tudo, menos Sonar |
| 2026-10-17 | SonarCloud | **Desligado** de forma consciente (`sonar: false`), ver A4 para reativar |
| 2026-10-17 | `CODEOWNERS` | `@IgorOCosta` no Backend, shared e bot |
| 2026-10-17 | Dependências da Etapa 2 | Aprovadas: `jose`, `@fastify/cookie`, `helmet`, `cors`, `rate-limit` |
| 2026-10-17 | Autorizações ao agente | Criar issues, rótulos e milestones; `push` de branches de trabalho; PR em rascunho. **Sem** merge, sem secrets, sem proteção de branch |
| 2026-10-17 | Biblioteca do bot | Dono escolheu o **neonize** (Python) no lugar do Baileys: [ADR 0015](docs/adr/0015-bot-em-python-com-neonize.md). **Implementação adiada** por falta de conta de WhatsApp para testar (A9) |
| 2026-10-17 | Design de UI/UX | Protótipo do Claude Design registrado em `frontend_web/design/` (PR frontend_web#6), com README de como reabrir no Claude Design |
| 2026-10-17 | Prioridade de desenvolvimento | "Núcleo do leilão primeiro": Sprint 03 (catálogo e estoque) e Sprint 05 (motor de leilões); a API de admin (Sprint 02) fica para depois |
| 2026-10-17 | Regra "limite de lojas" | Decisão do agente, reversível: conta as lojas em que a pessoa é proprietária (`produto.md`, regra 3) |

## O que o agente nunca faz sozinho

Merge de PR · criar ou ler secrets · mexer em proteção de branch, Environments ou permissões ·
`push` na branch padrão ou `push --force` (ver D9) · deploy em `homolog` ou `prod` · usar dado
real de usuário · escolher por você uma decisão desta lista.
| 2026-10-18 | D12: idioma do código | Frontend: `en` e `pt-BR`, código só em inglês ([ADR 0017](docs/adr/0017-localizacao-ingles-e-portugues.md)). **Backend fica como está**, com comentários e mensagens em português |
