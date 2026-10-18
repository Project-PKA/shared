# 12. Acesso somente por convite e administração da plataforma

Data: 2026-10-17

## Status

Aceita. Complementa a [ADR 0008](0008-autenticacao-passwordless-e-multi-tenant.md)
(o login por OTP continua; muda quem pode ter conta e criar loja).

## Contexto

O design definiu que **não existe cadastro aberto**: a landing tem "Solicitar
acesso", e quem opera a plataforma cria a loja e convida o proprietário. Isso
exige um papel acima das lojas (administrador da plataforma), que não existia,
e muda o que o login pode fazer. Afeta Backend, Frontend e, por causa do RLS
(ADR 0011), o desenho do banco.

## Decisão

1. **Sem cadastro aberto.** Uma conta só nasce por **convite** (de proprietário
   ou de administrador) ou por criação do administrador. O pedido de OTP para
   um e-mail sem conta devolve a **mesma resposta** que para um com conta, e
   não envia código nem cria usuário.
2. **Estados do usuário:** `INVITED` (convidado, ainda não aceitou), `ACTIVE`
   e `SUSPENDED`. Suspender **impede o login e revoga as sessões**, sem apagar
   dados.
3. **Administrador da plataforma** é uma marca no usuário
   (`is_platform_admin`), concedida só por operação interna: um comando de
   linha na VPS, nunca por tela nem por API. Não há "primeiro usuário vira
   admin".
4. **Permissão global de criar lojas**, com **limite de lojas próprias**,
   concedida pelo administrador. Sem ela, "Criar nova loja" não aparece e a
   API recusa.
5. **Convites** são registros próprios: tipo (proprietário ou funcionário),
   loja, papel e permissões, e-mail, quem convidou, **expiração**, status
   (pendente, aceito, expirado, revogado). O token do convite é aleatório de
   alta entropia e guardado só como hash. O administrador pode reenviar e
   revogar.
6. **Solicitações de acesso** (formulário público da landing) são registros
   próprios, com proteção contra abuso (limite por IP, campo-isca e validação),
   e não criam usuário nem loja: o administrador decide ("Criar loja e
   convidar" ou "Recusar").
7. **O administrador não altera dados internos das lojas** (estoque, leilões,
   WhatsApp, equipe). Isso é garantido **no banco**: as políticas de RLS dão ao
   papel de administrador leitura de `stores` e `store_members` e criação de
   loja, e **nenhum acesso** às tabelas de estoque, clientes, leilões, lances
   e acertos.
8. **Transferir propriedade** é ação do administrador, com registro no log de
   atividades: o proprietário atual passa a funcionário e o novo vira
   proprietário, sem nunca deixar uma loja sem proprietário.

## Consequências

- **Mais fácil:** controle total de quem entra, sem spam de contas e sem
  loja fantasma. A fronteira do administrador é verificável por teste.
- **Mais difícil:** existe um fluxo de convite inteiro (e-mail, expiração,
  reenvio, revogação) antes de qualquer pessoa conseguir entrar. O e-mail
  deixa de ser opcional: o provedor precisa estar decidido antes de `homolog`.
- **Risco:** a conta do administrador é a mais valiosa do sistema. Exige
  proteção reforçada (sessão curta, log de todas as ações, e avaliar segundo
  fator para o papel).
- **Esquema novo** (migration, Etapa 2): campos de estado, permissão e limite
  em `users`; tabelas `invitations` e `access_requests`; limites em `stores`.
