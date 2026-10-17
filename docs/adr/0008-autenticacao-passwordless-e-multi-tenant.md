# 8. Autenticação passwordless e multi-tenancy

Data: 2026-10-17

## Status

Aceita

## Contexto

O público é lojista, sem senha para gerenciar. Um mesmo e-mail pode operar várias lojas, e os dados entre lojas não podem vazar. Afeta Backend e Frontend.

## Decisão

1) Login passwordless: e-mail + código OTP numérico enviado por e-mail. O OTP é guardado como hash, com expiração e limite de tentativas (o rascunho original previa `otp_code` em texto puro, o que foi rejeitado). 2) Um usuário pode ter papéis em várias lojas (`store_members`: `OWNER` ou `STAFF`, com permissões em JSONB). 3) Toda rota autenticada, exceto a seleção de loja, exige o header `x-store-id`; o Backend valida o acesso em `store_members` e filtra todas as queries por `store_id`. 4) Sessão: access JWT de vida curta no header `Authorization` e refresh token em cookie `httpOnly`, rotacionado e guardado como hash para permitir revogação. PENDENTE: provedor de e-mail.

## Consequências

Sem senha para vazar nem resetar. Depende da entregabilidade do e-mail. O filtro por `store_id` é regra de toda query de negócio; a única tabela global é `tcgdex_catalog` (ADR 0009).
