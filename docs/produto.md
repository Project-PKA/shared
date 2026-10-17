# Escopo de produto: pokemonAuction

> Nome provisório. Este documento junta o **doc 01** (requisitos originais,
> fora do repositório) e o **adendo do design** (protótipo em baixa fidelidade,
> 2026-10-17). Onde os dois divergem, **vale o adendo**. A coluna "Origem"
> diz de onde veio cada regra. Decisões técnicas estão nas ADRs; aqui fica o
> **que o produto faz**.

## 1. Papéis

| Papel | Quem é | Como entra | Alcance |
| --- | --- | --- | --- |
| **Administrador da plataforma** | Quem opera o SaaS | Criado pela operação (não existe tela de cadastro) | Usuários, permissões globais, criação de lojas, convites. **Não altera** estoque, leilões, WhatsApp nem equipe de uma loja |
| **Proprietário** | Dono da loja | Convite do administrador | Tudo na loja, inclusive financeiro, equipe e log de atividades |
| **Funcionário** | Equipe da loja | Convite do proprietário | Por padrão, tudo **exceto excluir**; permissões ajustáveis (RBAC) |
| **Participante do grupo** | Quem dá lance no WhatsApp | Não entra no sistema | Vira **Visitante** ao dar o primeiro lance |
| **Comprador** | Visitante que ganhou | Link público do acerto | Preenche CPF e endereço com consentimento LGPD e avisa o pagamento |
| **Consignador** | Dono de carta consignada | Link público + chave de acesso | Acompanha a carta e a estimativa de repasse; só leitura |
| **Visitante do site** | Qualquer pessoa | Landing e vitrine | Vê a landing, a vitrine ao vivo e pede acesso |

Um mesmo e-mail pode ser proprietário ou funcionário de **várias lojas**, com
dados 100% isolados.

## 2. Regras de negócio vigentes

| # | Regra | Origem |
| --- | --- | --- |
| 1 | **Acesso somente por convite.** Não existe cadastro aberto. A landing tem "Solicitar acesso", não "Criar conta" ([ADR 0012](adr/0012-acesso-somente-por-convite-e-administracao-da-plataforma.md)) | Adendo |
| 2 | Login sem senha: e-mail + código OTP de 6 dígitos ([ADR 0008](adr/0008-autenticacao-passwordless-e-multi-tenant.md)) | Doc 01 + adendo |
| 3 | Só o administrador cria lojas. Um usuário só cria lojas por conta própria se o administrador liberar a **permissão global**, com **limite de lojas**. O limite conta as lojas em que a pessoa é **proprietária** (definido na Sprint 01) | Adendo |
| 4 | **A plataforma não realiza vendas nem garante pagamento ou entrega.** Pagamento e envio são combinados entre loja e comprador ([ADR 0013](adr/0013-plataforma-nao-vende-nem-garante-pagamento-ou-entrega.md)) | Adendo (reforça a [ADR 0002](adr/0002-mvp-sem-pagamento-e-sem-envio.md)) |
| 5 | O recurso se chama **"Acertos e cadastro de compradores"**. O nome "Anti-Calote" não é usado | Adendo |
| 6 | **Cada leilão é de uma carta só.** Não há leilão com várias cartas | Doc 01 + adendo |
| 7 | Origem da carta (**Própria** ou **Consignada**) **não vem pré-selecionada**; salvar fica desabilitado até a escolha | Adendo |
| 8 | Lance por `#ID valor`; vários leilões simultâneos no mesmo grupo ([ADR 0003](adr/0003-identificacao-de-lances-por-id-unico.md)) | Doc 01 |
| 9 | Enquete com teto: ao atingir, **não fecha sozinha**; o lojista aprova o encerramento ou mantém aberta ([ADR 0004](adr/0004-modalidades-lance-livre-e-enquete.md)) | Doc 01 + adendo |
| 10 | Quem dá lance sem cadastro vira **Visitante**; o cadastro completo é exigido no acerto ([ADR 0005](adr/0005-cadastro-de-clientes-sob-demanda.md)) | Doc 01 |
| 11 | No acerto, **o próprio comprador** preenche CPF e endereço numa página pública, com consentimento LGPD ([ADR 0014](adr/0014-paginas-publicas-por-link-e-vitrine.md)) | Adendo (muda o doc 01, em que a loja preenchia) |
| 12 | O vencedor é anunciado **no grupo**; o bot não manda mensagem privada automática ([ADR 0006](adr/0006-notificacao-publica-do-vencedor.md)) | Doc 01 |
| 13 | **Filtros de período (Hoje, 7, 15, 30 dias) existem só no Financeiro.** A Home é "ao vivo", sem seletor de período e sem controle visível de auto-refresh; cada componente se atualiza sozinho | Adendo (substitui o RF14 do doc 01) |
| 14 | Cartas sem leilão aparecem na Home como lembrete e como KPI | Adendo |
| 15 | A loja pode **optar por não aparecer** na vitrine pública | Adendo |
| 16 | O administrador **suspende** um usuário (impede o login, não apaga dados) | Adendo |
| 17 | Mudança de plano é **solicitada à administração**; não há autoatendimento | Adendo |
| 18 | O log de atividades (quem excluiu, aprovou ou mudou permissões) é visível **só ao proprietário** | Adendo |
| 19 | A busca de cartas não cita a marca do catálogo na interface ("catálogo de cartas") | Adendo |

## 3. Mapa de telas

### Públicas (sem login)

| Tela | O que tem |
| --- | --- |
| **Landing (SEO)** | Hero, "Como funciona" em 4 passos, 9 funcionalidades, vitrine, dashboards, "Para quem é", preços, FAQ, rodapé |
| **Vitrine de leilões ao vivo** | Cartões de toda a plataforma: loja, foto, estado, idioma, maior lance, nº de lances, último lance, tempo restante; "Ir para o leilão" leva ao grupo de WhatsApp da loja; filtros por loja, idioma e ordenação |
| **Solicitar acesso** | Nome, e-mail, WhatsApp, nome da loja e mensagem |
| **Aceitar convite** | Mostra loja, papel e permissões do funcionário |
| **Acerto do cliente** | Resumo das cartas e do frete, CPF e endereço com máscara e consentimento LGPD, chave PIX da loja, comprovante opcional, "Já paguei, avisar a loja" |
| **Acompanhamento do consignador** | Ver a seção 5 |
| **Termos de uso, Política de Privacidade, 404** | Texto jurídico a revisar por profissional |

### Dentro da plataforma, por loja

| Tela | O que tem |
| --- | --- |
| **Login e seleção de loja** | OTP; carrossel de lojas em formato de carta; o card "Criar nova loja" só aparece para quem tem a permissão |
| **Nova loja** | Dados da loja, QR do WhatsApp e escolha do grupo |
| **Home (operacional, ao vivo)** | Alerta de enquetes aguardando validação; 5 KPIs (leilões ativos agora, agendados hoje, lances nos ativos, acertos pendentes, cartas sem leilão); lembrete de cartas sem leilão; fila de acertos rápidos. **Sem** rankings e sem seletor de período |
| **Estoque** | Lista com filtros; estado vazio; detalhe da carta (dados, fotos, observações, histórico de leilões; excluir exige permissão) |
| **Cadastro de carta** (tela única) | Busca com a arte oficial; dados da carta com **Observações**; Origem; bloco **Leilão** (agendar, lançar agora ou deixar para depois; tipo, lance mínimo, incremento, teto da enquete); gera o link do consignador quando a origem é Consignada |
| **Leilões** | Lista, sala de lances ao vivo, **editar** (reagendar, alterar tipo e valores, cancelar), **aprovar enquete** (valor máximo, lance atual, vencedor provisório; "Aprovar encerramento" ou "Manter aberto") |
| **Clientes** | Base, perfil com abas de Acerto, Histórico e **Carteira de consignação** (link de acompanhamento e atalho "ver como consignador"), moderação (blacklist e inatividade) |
| **Envios** | Fila das vendas confirmadas (a enviar, enviado, entregue), código de rastreio, "Avisar cliente no WhatsApp" |
| **Funcionários** | Equipe, convite por e-mail e matriz de permissões |
| **Financeiro** | **Único** com filtro de período. Linha com área (faturamento e lucro por dia), histogramas (vendas por faixa de valor, lances por horário), pizzas (origem do faturamento, idioma, estado de conservação), top compradores, tabela de repasses de consignação, 4 KPIs |
| **Configurações** | WhatsApp (QR e grupo), templates de mensagens, **Assinatura** (link para Plano), **Vitrine pública** |
| **Plano e cobrança** | Plano atual, uso (grupos, membros, cartas), forma de pagamento, faturas; mudança de plano via administração |
| **Notificações e log de atividades** | O log só para o proprietário |
| **Perfil do usuário** | Foto, dados pessoais (telefone e CPF), endereço, idioma padrão, tema (claro, escuro, sistema), fuso, moeda, notificações, sessões ativas |

### Estados especiais

- **Sem permissão:** diz qual permissão falta e oferece "Pedir acesso ao proprietário".
- **Home vazia (loja nova):** checklist de 4 passos (loja criada, conectar WhatsApp e grupo, cadastrar a primeira carta, agendar o primeiro leilão).
- **Estoque vazio.**
- **WhatsApp desconectado com leilões ativos:** alerta crítico com a quantidade de leilões afetados, QR para reconectar, tabela dos afetados com "+30 min" por linha e "estender todos", e aviso de que lances enviados durante a queda podem não ter sido registrados.

### Área `/admin` (administração da plataforma)

Layout próprio, com selo "/admin". O administrador **não** mexe em dados internos
das lojas.

| Tela | O que tem |
| --- | --- |
| **Painel** | KPIs (usuários ativos, lojas ativas, convites pendentes, solicitações de acesso), solicitações novas, lojas com WhatsApp desconectado (só acompanhamento) |
| **Usuários** | Lista com busca e filtros (status, pode criar lojas), lojas, status (ativo, convite pendente, suspenso), último acesso; "Cadastrar usuário" envia convite |
| **Detalhe do usuário** | Dados; permissões globais ("Pode criar novas lojas" e limite de lojas próprias); lojas vinculadas (só leitura); reenviar convite; suspender acesso |
| **Lojas** | Proprietário, plano, membros, status do WhatsApp; **transferir propriedade** (o proprietário atual vira funcionário) |
| **Criar loja** | Nome, cidade, plano, limite de membros, proprietário (novo convidado ou existente), permissão de criar lojas, enviar convite agora |
| **Convites e solicitações** | Aba de convites (tipo, loja, expiração, status; reenviar e revogar); aba de solicitações ("Criar loja e convidar" ou "Recusar") |

## 4. O que mudou em relação ao doc 01

| Doc 01 | Agora |
| --- | --- |
| Qualquer pessoa cria loja ("Criar Loja" na seleção) | Só por convite do administrador; criar por conta própria só com permissão global e limite |
| RF14: Home com filtros 1, 7, 15 e 30 dias, rankings e auto-refresh | Home ao vivo, sem período e sem rankings; período só no Financeiro |
| RF11: a loja preenche CPF e endereço do comprador | O comprador preenche numa página pública, com consentimento LGPD |
| RF03: origem da carta com padrão | Sem padrão; escolha obrigatória |
| Sem vitrine, sem landing | Landing de SEO e vitrine pública opcional |
| Sem administração da plataforma | Área `/admin` e papel de administrador |
| Sem acompanhamento do consignador | Página pública por link, com chave de acesso |
| Sem envios, planos, perfil, notificações, log | Todos adicionados |

## 5. Acompanhamento do consignador

- Ao escolher **Consignada** no cadastro da carta, o sistema gera um link de
  acompanhamento para a loja enviar ao dono da carta ("Copiar link" e "Enviar
  no WhatsApp").
- **Chave de acesso do desenho:** os 4 primeiros dígitos do CPF do consignador,
  em 4 quadrados separados. Exige CPF cadastrado.
- **Depois da chave, a página mostra:** a carta (nome, número, estado, idioma,
  foto); a situação do leilão e o tempo restante; os lances ao vivo com
  telefones parcialmente ocultos; o maior lance e a **estimativa de repasse**
  (lance menos a comissão da loja), com aviso de que o valor final só vale
  após o encerramento e a confirmação da venda; e as outras cartas dele na
  loja.
- **Esta chave é fraca** (10 mil combinações, e os 4 primeiros dígitos do CPF
  não são aleatórios). O adendo previa limites só na Fase 2. A [ADR 0014](adr/0014-paginas-publicas-por-link-e-vitrine.md)
  os torna **obrigatórios desde o primeiro dia**.

## 6. Fora do MVP ou a definir

| Item | Situação |
| --- | --- |
| Cobrança da **assinatura** da plataforma (forma de pagamento, faturas, gateway) | A definir. O adendo mostra "forma de pagamento e faturas", mas a ADR 0002 é sobre os leilões, não sobre a assinatura da plataforma |
| Idioma (l10n) além do português | Previsto no perfil, não no MVP |
| Moeda além do real | Previsto no perfil |
| Armazenamento de fotos, avatar e comprovante | A decidir (disco da VPS ou bucket) |
| "Avisar cliente no WhatsApp" (Envios) | A decidir: link `wa.me` aberto pela loja (coerente com a ADR 0006) ou mensagem enviada pelo bot |
| Texto de Termos de uso e Política de Privacidade | Profissional jurídico |
| Uso da arte e dos nomes das cartas, e atribuição ao catálogo | Conferir a licença do catálogo e as regras de marca antes de publicar a vitrine |
