# 4. Modalidades de leilão: lance livre e enquete com teto manual

Data: 2026-10-17

## Status

Aceita

## Contexto

Um usuário mal-intencionado poderia dar o lance máximo falso só para travar o leilão por fechamento automático. Afeta Backend, Bot e Frontend.

## Decisão

Existem duas modalidades. `FREE_BID` acaba no horário agendado. `POLL` (enquete) tem valor máximo: ao atingi-lo, o sistema NÃO encerra. Ele marca `max_value_reached_alert`, muda o leilão para `PAUSED_FOR_VALIDATION` e avisa o lojista no painel, que valida e encerra.

## Consequências

Protege a loja de lance falso no teto. Custa uma ação manual do lojista e exige um canal de aviso em tempo real do Backend para o painel (WebSocket ou polling, a decidir).
