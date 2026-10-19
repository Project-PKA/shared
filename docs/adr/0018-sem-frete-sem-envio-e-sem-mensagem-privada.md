# 18. Sem frete, sem envio e sem mensagem privada

Data: 2026-10-18

## Status

Aceita, por decisão do dono (`OWNER.md`, D7 e D22). Complementa a [ADR 0002](0002-mvp-sem-pagamento-e-sem-envio.md)
e a [ADR 0006](0006-notificacao-publica-do-vencedor.md); não as substitui.

## Contexto

A ADR 0002 deixou o frete como um valor digitado pela loja no acerto e criou uma fila de envios
(a enviar, enviado, entregue, com rastreio). O desenho também previa um botão "Avisar cliente no
WhatsApp", que levantou a dúvida de quem manda a mensagem. O dono decidiu que o sistema **não trata
de frete nem de envio**, e que o número da loja só fala **no grupo**, porque mensagem privada para
muitos números sem contato salvo leva ao banimento (ADR 0006).

## Decisão

1. O sistema não tem **frete**: o total do acerto é a soma dos itens. A loja combina o envio por fora.
2. O sistema não tem **fila de envios**, rastreio nem estado de entrega. Saem a tabela `shipments`, o
   enum `shipment_status`, a coluna `settlements.shipping_cost`, as rotas `/v1/shipments*` e
   `PATCH /v1/settlements/{id}` (migration 0022 do Backend).
3. Não existe "Avisar cliente no WhatsApp", nem por link `wa.me`. O bot só publica **no grupo** (abertura,
   lance aceito, vencedor marcado). Nenhum serviço manda mensagem privada.
4. A página pública do acerto não mostra frete. A receita do financeiro continua sendo o valor dos itens.

## Consequências

- **Mais simples:** menos tabelas, menos telas e nenhum risco de ban por mensagem privada.
- **Mais difícil:** a loja precisa combinar entrega e rastreio fora do sistema (WhatsApp pessoal, correio).
  Se isso virar dor, reabrir com uma ADR nova.
- A migration 0022 é destrutiva, mas o produto ainda não tem dado real. O `down` recria as estruturas
  vazias; os valores de frete e a fila de envios não se recuperam.
