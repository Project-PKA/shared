# 3. Identificação de lances por hashtag + ID único, sem lotes

Data: 2026-10-17

## Status

Aceita

## Contexto

Vários leilões ocorrem ao mesmo tempo no mesmo grupo de WhatsApp. O bot precisa saber para qual carta cada mensagem é um lance sem se perder em conversa paralela. Afeta Backend (cadastro e `short_code`), Bot (parser) e Frontend (exibição).

## Decisão

Cada carta física é cadastrada individualmente (sem lotes) e recebe um `short_code` curto, único por loja. Um lance só é computado se a mensagem começar com `#` + ID, seguido do valor (ex.: `#A41 50` ou `#A41 R$ 50,00`). Demais mensagens são ignoradas. PENDENTE: definir se o banco guarda o `short_code` com ou sem o `#`; este documento e o GLOSSARY usam o ID sem `#`.

## Consequências

Leilões simultâneos sem confusão. Cartas de alto valor ficam com tratamento unitário. O ID aparece em mensagens públicas, então não pode revelar dado interno. O formato do parser vira contrato entre Backend e Bot e deve ter teste.
