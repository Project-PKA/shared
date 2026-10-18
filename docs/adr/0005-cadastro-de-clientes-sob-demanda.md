# 5. Cadastro de clientes sob demanda (visitantes)

Data: 2026-10-17

## Status

Aceita. Complementada pela [ADR 0014](0014-paginas-publicas-por-link-e-vitrine.md): o comprador passa a preencher os próprios dados numa página pública de acerto.

## Contexto

Exigir cadastro antes do lance mataria o impulso de compra no leilão ao vivo. Afeta Backend, Bot e Frontend.

## Decisão

Qualquer pessoa no grupo pode dar lance. O Bot captura nome (pushName) e telefone do WhatsApp e cria um Visitante (`is_visitor = true`), único por loja pelo telefone. O cadastro completo (CPF, e-mail, endereço) só é exigido no acerto, quando o Visitante é convertido em Cliente.

## Consequências

Zero atrito na venda. Em troca, a loja guarda dados de pessoas que nunca se cadastraram: tratar na revisão de LGPD (ver ARCHITECTURE.md, riscos aceitos).
