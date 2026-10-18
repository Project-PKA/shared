# 16. A decisão de lance vive numa função do banco

Data: 2026-10-17

## Status

Aceita, como consequência da [ADR 0015](0015-bot-em-python-com-neonize.md). **Reversível:** é
decisão técnica do agente, registrada aqui para o dono poder discordar (`OWNER.md`, D11).

## Contexto

A decisão sobre lances já estava tomada: transação com `SELECT ... FOR UPDATE` na linha do leilão,
validando incremento, maior lance e blacklist antes do `INSERT`; um trigger foi descartado. A premissa
era "um serviço no código, usado pelo bot e pela API". Com o bot em **Python** (ADR 0015) e a API em
**Node**, "o mesmo serviço no código" passa a significar a mesma regra escrita duas vezes, em duas
linguagens, num ponto onde um erro de concorrência custa caro.

## Decisão

1. A regra vive **uma vez só, numa função do PostgreSQL** (`place_bid`), que:
   - trava a linha do leilão (`FOR UPDATE`);
   - confere que o leilão está `ACTIVE` e dentro do período;
   - confere que o cliente não está na blacklist e pertence à mesma loja;
   - confere o valor mínimo (lance inicial ou maior lance + incremento);
   - grava o lance e, em enquete que atinge o teto, marca o alerta e muda o leilão para
     `PAUSED_FOR_VALIDATION` **sem encerrar**;
   - devolve um resultado tipado (`ACCEPTED` ou o motivo da recusa), sem lançar erro para regra de negócio.
2. É a mesma lógica já decidida (trava da linha, sem trigger); só muda **onde** ela mora. O RLS continua
   valendo: a função é `SECURITY INVOKER` e roda com o contexto da loja (`app.store_id`).
3. O Backend e o bot chamam `SELECT * FROM place_bid(...)`. O texto da mensagem de WhatsApp
   (`#A41 50`) continua sendo **interpretado no bot**; o banco só recebe valores já tipados.
4. A função tem testes de concorrência no Postgres real (lances simultâneos), como já estava previsto.

## Consequências

- **Mais fácil:** uma única implementação, testável com SQL, igual para qualquer linguagem de cliente;
  a corrida é resolvida onde o dado está.
- **Mais difícil:** regra de negócio em PL/pgSQL é mais difícil de ler e de depurar que TypeScript.
  Mitigação: função pequena, comentada, coberta por teste, e versionada em migration com `down`.
- Se o dono preferir manter a regra no código, a alternativa é o bot chamar a **API do Backend**
  para registrar o lance (um endpoint interno autenticado entre serviços). Custo: o bot passa a
  depender da API estar no ar e há que definir autenticação serviço a serviço. Decidir em D11.
