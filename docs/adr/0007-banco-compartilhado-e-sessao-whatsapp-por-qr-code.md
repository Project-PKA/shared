# 7. Banco compartilhado e sessão de WhatsApp por QR Code

Data: 2026-10-17

## Status

Aceita

## Contexto

A API oficial da Meta cobra por conversa e tem regras rígidas para grupos; um leilão gera centenas de mensagens. Cada sessão por QR Code consome cerca de 150 a 300MB de RAM por loja. O Bot é um repositório separado do Backend, mas precisa ler e escrever dados do leilão.

## Decisão

1) A conexão com o WhatsApp usa sessão WhatsApp Web via QR Code, com biblioteca Baileys, em vez da API oficial. 2) O Bot roda em repositório próprio (`whatsapp_microservice`) e acessa o mesmo PostgreSQL do Backend com uma role própria. 3) As migrations ficam SOMENTE no Backend. 4) A role do Bot tem acesso restrito a: `stores`, `customers`, `cards_inventory`, `auctions` e `bids` (leitura e escrita só onde o fluxo exige, a detalhar no ARCHITECTURE.md do Bot e do Backend). 5) `stores.whatsapp_session_data` é credencial e fica criptografada em repouso.

## Consequências

Custo de mensageria zero. Riscos aceitos: banimento do número e possível violação dos termos do WhatsApp. Mudança nas tabelas listadas é mudança de contrato e exige avisar o dono do Bot antes do merge. Uma sessão por loja limita quantas lojas cabem por VPS.
