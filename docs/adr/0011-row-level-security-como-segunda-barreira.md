# 11. Row-Level Security do Postgres como segunda barreira de isolamento

Data: 2026-10-17

## Status

Aceita

## Contexto

O sistema é multi-tenant e guarda dado pessoal de terceiros (CPF, telefone,
endereço). Hoje o isolamento entre lojas depende de duas coisas: toda query
de negócio filtrar por `store_id` (regra de código) e as FKs compostas
`(id, store_id)` (que impedem referência entre lojas, mas não impedem **ler**
a linha de outra loja). Um filtro esquecido numa query nova expõe a base de
outra loja, e isso é exatamente o erro que revisão humana deixa passar.

Afeta o Backend (todas as queries) e o `whatsapp_microservice` (que acessa o
mesmo banco).

## Decisão

Usar **Row-Level Security (RLS)** do PostgreSQL como segunda barreira, sem
substituir o filtro por `store_id` no código (defesa em profundidade).

1. **Contexto por transação.** O código abre a transação e executa
   `SELECT set_config('app.store_id', $1, true)` (escopo local) e, no login e
   na seleção de loja, `app.user_id`. Nenhuma query de negócio roda fora de
   uma transação com contexto.
2. **Negar por padrão.** As políticas comparam `store_id` com
   `current_setting('app.store_id', true)::uuid`. Sem contexto, o valor é
   `NULL`, a comparação não é verdadeira e a consulta devolve zero linhas.
3. **Tabelas cobertas:** `customers`, `cards_inventory`, `auctions`, `bids`,
   `settlements` e `settlement_items` (por `store_id`); `stores` e
   `store_members` (por `app.store_id` **ou** pertencimento do `app.user_id`,
   para o login listar as lojas do usuário antes de escolher uma).
   **Fora do RLS:** `users` e `refresh_tokens` (acessadas só pelo fluxo de
   autenticação) e `tcgdex_catalog` (global, ADR 0009).
4. **`FORCE ROW LEVEL SECURITY`** nas tabelas cobertas, para a política valer
   até para o dono da tabela.
5. **Três papéis de banco, nenhum `SUPERUSER`:**
   - `owner`/migração: dono do schema, com `BYPASSRLS`; usado **só** no
     deploy (migrations) e no seed de desenvolvimento.
   - `app_runtime`: o Backend em execução; sujeito ao RLS.
   - `bot`: o `whatsapp_microservice`; sujeito ao RLS e com privilégio mínimo
     nas tabelas (ADR 0007).
6. **Tarefas que olham várias lojas** (agendador que abre e fecha leilões,
   limpeza de inativos) iteram por loja definindo o contexto de cada uma.
   Se o agendador do bot precisar varrer todas de uma vez, a opção prevista é
   uma função `SECURITY DEFINER` restrita e auditada, **não** dar `BYPASSRLS`
   ao papel do bot. Decidir no bootstrap do `whatsapp_microservice`.

## Consequências

- **Mais fácil:** esquecer o filtro por `store_id` deixa de vazar dado, porque
  o banco devolve só a loja do contexto. Teste de acesso cruzado passa a
  falhar no banco, não só no código.
- **Mais difícil:** toda query de negócio precisa estar numa transação com
  contexto (um wrapper `withStore(storeId, fn)` no Backend e um equivalente no
  bot). Testes de RLS exigem um papel **sem** `BYPASSRLS`: o usuário padrão do
  Testcontainers é superusuário e ignora as políticas, então os testes criam e
  usam o papel `app_runtime`. O seed roda como `owner`.
- **Pegadinha:** conexão de pool que reutiliza o contexto de outra requisição
  é vazamento. Por isso o contexto é sempre `local` à transação (`true` no
  `set_config`), nunca da sessão.
- **Custo:** pequeno overhead por consulta (a política vira predicado) e mais
  uma peça para manter nas migrations. Aceito diante do tipo de dado guardado.
- **Entrega:** vai na **Etapa 2** do backlog, junto com a autenticação e o
  middleware multi-tenant, antes de qualquer rota de negócio.
