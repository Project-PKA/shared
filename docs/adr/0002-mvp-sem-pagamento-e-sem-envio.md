# 2. MVP sem gateway de pagamento e sem gestão de envio

Data: 2026-10-17

## Status

Aceita

## Contexto

Processar Pix/cartão e integrar com Correios aumenta muito a complexidade, as taxas e a superfície de segurança de um MVP. Afeta Backend (acerto) e Frontend (telas de acerto).

## Decisão

O sistema não processa pagamento nem integra com transportadora. O acerto soma as cartas ganhas com o frete informado manualmente pelo lojista, e o lojista muda o status do acerto para `PAID`.

## Consequências

Lançamento mais rápido e sem risco financeiro no sistema. O lojista confere o pagamento fora da plataforma. Gateway e envio ficam para uma fase posterior e exigirão nova ADR.
