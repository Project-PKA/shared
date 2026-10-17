# Glossário — pokemonAuction

Este glossário existe para que backend, frontend e microservices usem os
**mesmos termos com o mesmo significado** — em conversas e em nomes de
campos, endpoints, eventos e variáveis no código.

Regra geral: se um termo de negócio aparece em mais de um repositório, ele
deve estar aqui, com uma única definição.

## Como usar

- **Ao adicionar um termo novo:** inclua o termo em português e, se
  aplicável, o equivalente em inglês usado no código.
- **Em caso de divergência:** se dois repositórios usam nomes diferentes para
  o mesmo conceito, resolva aqui primeiro e depois alinhe os repositórios.
  Abra uma issue com o template "Decisão de arquitetura a discutir".

Repositórios nas colunas abaixo: `backend` = Backend, `frontend` =
frontend_web, `bot` = whatsapp_microservice.

## Pessoas e acesso

| Termo | Definição | Termo no código | Repositórios |
|---|---|---|---|
| Loja | Um lojista cliente do SaaS. É o tenant: seus dados são isolados das outras lojas. | `store`, `store_id` | `backend`, `frontend`, `bot` |
| Proprietário | Dono da loja. Acesso total, inclusive financeiro e permissões da equipe. | `OWNER` | `backend`, `frontend` |
| Funcionário | Pessoa convidada pelo proprietário. Por padrão opera tudo, exceto deletar registros. | `STAFF` | `backend`, `frontend` |
| Permissão | Liberação individual de uma ação ao funcionário (ex.: ver financeiro). | `permissions` | `backend`, `frontend` |
| Cliente | Pessoa com cadastro completo na loja (nome, telefone, e-mail, CPF, endereço). Pode comprar e consignar. | `customer` (`is_visitor = false`) | `backend`, `frontend`, `bot` |
| Visitante | Quem deu lance no grupo sem cadastro. Existe só com nome e telefone vindos do WhatsApp. Vira Cliente no acerto. | `customer` (`is_visitor = true`) | `backend`, `frontend`, `bot` |
| Consignador | Cliente que deixou cartas na loja para vender. Recebe o valor menos a comissão da loja. | `consignor_id` | `backend`, `frontend` |
| Blacklist | Lista de telefones de caloteiros ou de quem dá lance falso. O bot ignora os lances e remove o número do grupo. | `is_blacklisted` | `backend`, `frontend`, `bot` |

## Estoque

| Termo | Definição | Termo no código | Repositórios |
|---|---|---|---|
| Carta | Uma carta física única no estoque. Não existe lote: cada carta tem seu estado de conservação. | `cards_inventory` | `backend`, `frontend`, `bot` |
| Catálogo TCGdex | Base oficial de cartas copiada para o banco local toda madrugada. Serve de autocomplete no cadastro. É global, não pertence a loja. | `tcgdex_catalog` | `backend`, `frontend` |
| ID da carta | Código curto e único por loja (ex.: `A41`) usado para dar lance. Aparece com `#` no grupo (`#A41`). | `short_code` | `backend`, `frontend`, `bot` |
| Estoque próprio | Carta que pertence à loja. | `OWN` | `backend`, `frontend` |
| Consignada | Carta de um cliente, vendida pela loja com comissão. | `CONSIGNED` | `backend`, `frontend` |
| Comissão | Percentual do valor da venda que fica com a loja numa carta consignada. | `store_commission_pct` | `backend`, `frontend` |
| Estado de conservação | Condição física: Mint, NM, SP, MP, HP, Damaged. | `condition` (`MINT`, `NM`, `SP`, `MP`, `HP`, `DMG`) | `backend`, `frontend` |
| Disponível | Carta no estoque, livre para ser agendada. | `AVAILABLE` | `backend`, `frontend`, `bot` |
| Agendada em leilão | Carta vinculada a um leilão. Não pode ser editada. | `SCHEDULED` | `backend`, `frontend`, `bot` |
| Esperando confirmação | Leilão acabou; falta acerto e pagamento. | `AWAITING_CONFIRMATION` | `backend`, `frontend`, `bot` |
| Vendida | Acerto concluído. | `SOLD` | `backend`, `frontend` |

## Leilão

| Termo | Definição | Termo no código | Repositórios |
|---|---|---|---|
| Leilão | Evento de venda de uma carta, com início, fim, lance inicial e incremento mínimo. | `auction` | `backend`, `frontend`, `bot` |
| Lance livre | Leilão que acaba no horário agendado. | `FREE_BID` | `backend`, `frontend`, `bot` |
| Enquete | Leilão com valor máximo. Ao atingir o teto, o sistema não fecha sozinho: avisa o lojista, que valida e encerra. | `POLL`, `max_poll_value` | `backend`, `frontend`, `bot` |
| Lance | Mensagem no grupo que começa com `#ID` seguido do valor (ex.: `#A41 50`). Só vale se o leilão estiver ativo, respeitar o incremento e o telefone não estiver na blacklist. | `bid` | `backend`, `bot` |
| Incremento mínimo | Quanto um lance precisa superar o maior lance atual. | `min_increment` | `backend`, `frontend`, `bot` |
| Aguardando validação | Enquete que atingiu o teto e espera decisão do lojista. | `PAUSED_FOR_VALIDATION` | `backend`, `frontend`, `bot` |
| Vencedor | Autor do maior lance ao fim do leilão. O bot o marca no grupo. | `winning_bid_id` | `backend`, `bot` |

## Fechamento e painéis

| Termo | Definição | Termo no código | Repositórios |
|---|---|---|---|
| Acerto | Fechamento pós-leilão com um comprador: soma das cartas ganhas mais o frete informado à mão. O lojista marca como pago. | `settlement` | `backend`, `frontend` |
| Pago | Acerto quitado fora do sistema (sem gateway no MVP). | `PAID` | `backend`, `frontend` |
| Repasse | Valor a pagar ao consignador depois da venda, descontada a comissão. | A DECIDIR | `backend`, `frontend` |
| Painel operacional | Home em tempo real: status do WhatsApp, vendas, lances, rankings e acertos pendentes, filtrada por 1, 7, 15 ou 30 dias. | `dashboard/operational` | `backend`, `frontend` |
| Dashboard financeiro | Visão de backoffice: faturamento bruto, lucro líquido, ticket médio, contas a pagar a consignadores. | A DECIDIR | `backend`, `frontend` |
| Inatividade | Regra opcional da loja para remover do grupo quem não interage há X dias. | `inactivity_days_limit` | `backend`, `frontend`, `bot` |
