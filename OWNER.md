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
| D1 | **Provedor de e-mail** (OTP e convites) | Deploy em `homolog` e `prod`: a API se recusa a subir com o provedor `log`. **Não trava** o desenvolvimento | Um provedor com domínio próprio (SPF e DKIM). Resend é o mais simples para começar; SES sai mais barato em volume | [shared#9](https://github.com/Project-PKA/shared/issues/9) | _Resolvida (2026-10-18): SMTP do Gmail por enquanto (senha de app em `EMAIL_PASSWORD`); trocar por provedor transacional depois, ver o item novo abaixo_ |
| D2 | **LGPD**: retenção e exclusão de dados pessoais, base legal e texto de consentimento | Sprints 04 e 06 (clientes, página de acerto). Também decide se "excluir loja" existe | Revisão por profissional jurídico antes de qualquer loja real. Posso preparar um rascunho técnico (o que guardamos, onde, por quanto tempo) para ele revisar | [shared#3](https://github.com/Project-PKA/shared/issues/3) | _aguardando_ |
| D3 | **Armazenamento de arquivos** (fotos de carta, avatar, comprovante) | Sprint 03 (fotos), 06 (comprovante) e 08 (avatar) | Disco da VPS com backup no início; bucket compatível com S3 quando crescer | [shared#10](https://github.com/Project-PKA/shared/issues/10) | _Resolvida (2026-10-18): disco da VPS, no backup; fotos das cartas já implementadas_ |
| D4 | **Segundo fator** para o administrador da plataforma | Produção (a conta mais valiosa do sistema) | Decidir antes de produção. Opção mínima: sessão curta e reautenticação por OTP em ação sensível | [shared#11](https://github.com/Project-PKA/shared/issues/11) | _Resolvida (2026-10-18): não precisa. O administrador é promovido direto no banco no primeiro boot (`npm run db:create-admin`) e o login já é por código no e-mail_ |
| D5 | **Licença do catálogo** e uso da arte e dos nomes das cartas | Publicar a vitrine pública (Sprint 08) | **Pesquisado (2026-10-17):** o repositório do catálogo (TCGdex) é **MIT**, mas não declara licença para as **imagens**, e o projeto avisa que não é afiliado à Nintendo nem à The Pokémon Company. Recomendo: usar o texto e os números do catálogo; **não copiar as imagens** (apontar para o endereço de origem, `assets.tcgdex.net`); pôr nos Termos e no rodapé que o produto não é afiliado nem endossado pelas marcas; e consultar um profissional sobre uso de marca na vitrine pública | [shared#6](https://github.com/Project-PKA/shared/issues/6) | _aguardando_ |
| D6 | **Cobrança da assinatura** da plataforma | Tela de Plano (Sprint 08) | Manual no MVP (fatura externa), como o "solicitar mudança de plano" do design indica | [shared#4](https://github.com/Project-PKA/shared/issues/4) | _aguardando_ |
| D7 | Como **"Avisar cliente no WhatsApp"** (Envios) envia a mensagem | Sprint 06 | Link `wa.me` aberto pela loja, coerente com a ADR 0006 (o bot não manda mensagem privada) | [shared#5](https://github.com/Project-PKA/shared/issues/5) | _aguardando_ |
| D8 | **Revisão por CODEOWNER com uma pessoa só** | Merge de qualquer PR, se a proteção exigir | **Não exigir** aprovação de CODEOWNER enquanto você for o único: o autor não aprova o próprio PR e nada mergearia. Exigir só o `ci-success` (Backend) e a validação do contrato (shared). Quando entrar a segunda pessoa, ligar a exigência | [shared#12](https://github.com/Project-PKA/shared/issues/12) | _aguardando_ |
| D11 | **Onde mora a regra de lance** (consequência do bot em Python) | Sprint 05 (motor de lances) | Já decidi, reversível ([ADR 0016](docs/adr/0016-decisao-de-lance-em-funcao-do-banco.md)): uma função `place_bid` no Postgres, com trava da linha do leilão, chamada pelo Backend e pelo bot. Alternativa: o bot chamar um endpoint interno do Backend. Diga se prefere a outra | [shared#14](https://github.com/Project-PKA/shared/issues/14) | _decisão do agente, **já implementada** (migration 0013 do Backend); ainda reversível, aguardando ok_ |
| D14 | **Revisar as suposições** dos painéis, do plano e dos acertos (receita sem frete, lucro, fuso, plano como rótulo, quem marca como pago) | Nada trava | Estão em uma lista curta, todas fáceis de mudar | [shared#15](https://github.com/Project-PKA/shared/issues/15) | _aguardando_ |
| D15 | **Aprovar o papel de banco do bot** (`bot_runtime`) | Fase 2 do bot em diante (até lá, papel provisório de teste). Pedido detalhado em [Backend#98](https://github.com/Project-PKA/Backend/issues/98): `place_bid` e `advance_auctions` são `SECURITY INVOKER`, então o papel precisa também de privilégios de tabela | Papel `NOLOGIN` sem `BYPASSRLS`, RLS por transação e uma função `SECURITY DEFINER` para atualizar o estado do WhatsApp | [shared#16](https://github.com/Project-PKA/shared/issues/16) | _aguardando_ |
| D16 | **Trocar o SMTP do Gmail** por um provedor transacional (limite de ~500/dia, sem domínio próprio) | Antes de abrir para lojas reais com volume | Resend ou SES com domínio próprio (SPF e DKIM). No Backend é só trocar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` e `EMAIL_PASSWORD` | [shared#23](https://github.com/Project-PKA/shared/issues/23) | _aguardando (depende de VPS e domínio)_ |
| D10 | **Nome do produto** (hoje `pokemonAuction`, provisório) | Nada trava; a troca fica mais cara quanto mais tarde | Decidir antes do primeiro deploy: o nome aparece no README, nos docs, no `issuer` do JWT, no nome da imagem e na landing | [shared#13](https://github.com/Project-PKA/shared/issues/13) | _aguardando_ |
| D20 | **Como o painel pede o QR ao bot e como o QR chega à tela** (hoje não há canal: o bot só abre sozinho a loja que já tem sessão pareada) | Tela "Nova loja / reconectar WhatsApp" de ponta a ponta | Backend registra o pedido numa coluna ou tabela (ex.: `whatsapp_pair_requested_at`) que o bot consulta a cada minuto; o bot devolve o QR numa linha de vida curta (expira em 60 s) lida só pela loja do contexto. Evita chamada direta Backend→bot (ADR 0007 deixou isso em aberto). Se preferir HTTP interno, vira ADR | [Backend#98](https://github.com/Project-PKA/Backend/issues/98) | _aguardando_ |

## Para fazer no GitHub e em contas

Só você consegue. O agente não cria secrets, não mexe em proteção de branch nem em Environments.

| ID | Ação | Quando | Passo a passo | Issue |
| --- | --- | --- | --- | --- |
| A1 | **Proteção de branch** em `main` (Backend e shared) | Antes de ter mais de uma pessoa, ou quando quiser travar o `main` | Settings, Branches, Add rule em `main`: exigir PR e o check `ci-success` (Backend) ou `Lint com Spectral` (shared). **Sem** "Require review from Code Owners" (ver D8). Detalhes em `Backend/SETUP-GITHUB.md`, B3 | [Backend#5](https://github.com/Project-PKA/Backend/issues/5), [shared#1](https://github.com/Project-PKA/shared/issues/1) · [shared#17](https://github.com/Project-PKA/shared/issues/17) |
| A2 | **`AUTOMATION_TOKEN`** e variables | Para publicar o contrato no shared por PR, abrir PR de release e usar o agente do GitHub | Criar um PAT fine-grained com acesso aos 4 repositórios (contents, pull requests, issues, projects) e cadastrar como secret `AUTOMATION_TOKEN`. Variables: `CONTRACT_REPO=Project-PKA/shared`, `CODEQL_LANGUAGES=javascript-typescript`, `PROJECT_URL` (se criar o Projects) | [shared#2](https://github.com/Project-PKA/shared/issues/2) |
| A3 | **Environments** `dev`, `test`, `homolog` (com aprovação) e `prod` (com aprovação) | Quando existir VPS e deploy | `Backend/SETUP-GITHUB.md`, B4. Os nomes dos secrets estão em `Backend/docs/secrets.md` | [Backend#5](https://github.com/Project-PKA/Backend/issues/5) · [shared#17](https://github.com/Project-PKA/shared/issues/17) |
| A4 | **SonarCloud** (hoje **desligado**) | Quando quiser a análise de qualidade e o Quality Gate | Criar o projeto no SonarCloud, gerar o token e cadastrar o secret `SONAR_TOKEN`; preencher `sonar.organization` e `sonar.projectKey` em `Backend/sonar-project.properties`; remover `sonar: false` do `ci.yml`; desligar a "Automatic Analysis" no SonarCloud | [Backend#6](https://github.com/Project-PKA/Backend/issues/6) · [shared#18](https://github.com/Project-PKA/shared/issues/18) |
| A5 | **Secret scanning** e **push protection** | Já | Settings, Code security, ativar nos 4 repositórios (`SETUP-GITHUB.md`, A4) | [Backend#5](https://github.com/Project-PKA/Backend/issues/5) · [shared#17](https://github.com/Project-PKA/shared/issues/17) |
| A9 | **Conta de WhatsApp para testar o bot** | Toda a implementação do bot (Sprint 05). Sem ela, o bot só avança com eventos simulados | Um número dedicado a teste (chip pré-pago serve) e um grupo de teste onde ele seja administrador. Nunca usar o número da loja real para teste | [whatsapp_microservice#1](https://github.com/Project-PKA/whatsapp_microservice/issues/1) · [shared#20](https://github.com/Project-PKA/shared/issues/20) |
| A7 | **VPS e domínio** | Para qualquer deploy | Contratar a VPS e registrar o domínio. Ver `Backend/DEPLOY.md` (requisitos de segurança) | — · [shared#19](https://github.com/Project-PKA/shared/issues/19) |
| A8 | **Quadro do GitHub Projects** (opcional) | Se quiser o quadro | Rode `gh auth refresh -s project` (abre o navegador) e me avise; eu crio o quadro. Os milestones já fazem o papel | — · [shared#21](https://github.com/Project-PKA/shared/issues/21) |
| A10 | **`SMTP_USER` e `EMAIL_PASSWORD` no `.env` da VPS** (e `SMTP_USER` como variable no GitHub) | No primeiro deploy em `homolog`/`prod` | Seu endereço Gmail e a **senha de app** do Google (já guardada como secret `EMAIL_PASSWORD`). O deploy não copia secrets do GitHub para a VPS: coloque no `.env` de lá. Modelo em `Backend/deploy/env.example` | — |

### PRs abertos

| Repositório | PR | O que é |
| --- | --- | --- |
| Backend | [#84](https://github.com/Project-PKA/Backend/pull/84) | "Já paguei" do comprador (só avisa a loja). Aguardando seu ok para mergear |
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
| 2026-10-18 | D13: desenho das páginas públicas | **Aprovado** pelo dono (papel `public_runtime` sem acesso a tabelas, só `EXECUTE` em funções `SECURITY DEFINER` com `search_path` fixo). Implementado nos PRs do Backend |
| 2026-10-18 | `ioredis` | Dependência exigida pelo BullMQ 6; o dono mandou manter |
| 2026-10-18 | D9: merge da pilha de PRs | **Merge commit, um a um**, de baixo para cima (Backend #66 a #78), com 'Automatically delete head branches' ligado para o GitHub redirecionar o próximo PR para `main`. Sem squash e sem reescrever branch |
| 2026-10-18 | A6: revisar e mergear os PRs | **Feito**: Backend #66 a #78 e shared #7 mergeados por merge commit, de baixo para cima. O CI de `main` ficou verde |
| 2026-10-18 | Backend até a Sprint 08 | Catálogo, estoque, leilões, clientes, acertos, envios, páginas públicas, painéis, administração, perfil, notificações, plano e vitrine estão em `main`. Sobra o que depende das decisões acima (e-mail, armazenamento, LGPD, bot) |
| 2026-10-18 | D17: sessão do WhatsApp | **Opção (a)**: Postgres só do bot; `whatsapp_sessions` guarda só o estado de conexão ([shared#28](https://github.com/Project-PKA/shared/issues/28)) |
| 2026-10-18 | D18: significado de POLL | **Lance numérico `#ID valor` com teto** (o que `place_bid` já faz); enquete nativa fora do escopo |
| 2026-10-18 | D19: foto da carta no bot | **Volume somente leitura** (`STORAGE_DIR`) |
