# 9. PostgreSQL híbrido e sync offline do TCGdex

Data: 2026-10-17

## Status

Aceita

## Contexto

O cadastro de carta precisa de autocomplete instantâneo, e o sistema não pode depender da API do TCGdex estar no ar durante o expediente do lojista. Afeta Backend, Frontend e o banco compartilhado com o Bot.

## Decisão

Um único PostgreSQL para tudo: tabelas de negócio relacionais e o catálogo oficial em `tcgdex_catalog`, com os dados completos em coluna JSONB e índice GIN com `gin_trgm_ops` (`pg_trgm`) em nome e número. Um cron às 03:00 faz pull do repositório `tcgdex/cards-database` e executa `INSERT ... ON CONFLICT (id) DO UPDATE`. O catálogo é global, compartilhado entre lojas, e é a exceção consciente à regra de filtrar por `store_id`.

## Consequências

Sem segundo banco para manter e sem dependência de rede no autocomplete. O banco guarda uma cópia do catálogo e depende do job rodar. A extensão `pg_trgm` e o índice GIN entram por migration SQL escrita à mão.
