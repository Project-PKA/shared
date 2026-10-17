# 10. Infraestrutura inicial em VPS

Data: 2026-10-17

## Status

Aceita

## Contexto

As sessões de WhatsApp consomem RAM por loja conectada. Arquitetura de nuvem complexa é prematura para validar o produto. Afeta o deploy de todos os repositórios.

## Decisão

Todos os serviços rodam inicialmente em uma VPS Linux, com custo fixo e previsível. O formato do deploy (docker compose via SSH, registry, domínio, rotina de migrations) é decidido no bootstrap do Backend, etapa 11, e vale para os demais.

## Consequências

Baixo custo e simplicidade. Sem escala horizontal automática: o gatilho para revisitar é o número de lojas conectadas versus a RAM da máquina.
