# 15. Bot de WhatsApp em Python com neonize

Data: 2026-10-17

## Status

Aceita (escolha do dono). **Implementação adiada**: não há conta de WhatsApp disponível para
testar. Substitui, na [ADR 0007](0007-banco-compartilhado-e-sessao-whatsapp-por-qr-code.md),
apenas a biblioteca (Baileys) e, por consequência, a linguagem do bot.

## Contexto

A ADR 0007 escolheu uma sessão WhatsApp Web por QR Code com **Baileys** (Node.js). O dono decidiu
usar o **neonize**, e já indicou as peças que pretende usar:

```python
from neonize.client import NewClient
from neonize.events import ConnectedEv, MessageEv, PairStatusEv
from neonize.utils.jid import JIDToNonAD, Jid2String, jid_is_lid
```

O neonize é um SDK Python sobre o **whatsmeow** (Go), chamado por uma biblioteca compartilhada.
Verificado em 2026-10-17: Apache-2.0; versão 0.5.2 (setembro de 2026); Python 3.10 ou mais novo;
wheels para Windows (x64), Linux (x86_64 e aarch64) e macOS; sessão em SQLite (padrão) ou
PostgreSQL; FFmpeg só para mídia. A documentação não deixa claro, e **precisa ser testada com uma
conta real**: listar grupos, remover participante, eventos de entrada no grupo e o envio de imagem
com legenda. Continua sendo cliente **não oficial** do WhatsApp: o risco de banimento e de violação
dos termos aceito na ADR 0007 permanece o mesmo.

## Decisão

1. O `whatsapp_microservice` é escrito em **Python ≥ 3.10** com **neonize**. O contrato de
   comandos do template (`Makefile` + `project.mk`) é agnóstico de stack e continua valendo
   (ruff, mypy e pytest no lugar de ESLint, tsc e Vitest).
2. O código do bot **não duplica regra de negócio do Backend**. A decisão de lance vive numa função
   do banco ([ADR 0016](0016-decisao-de-lance-em-funcao-do-banco.md)), que o Backend (Node) e o bot
   (Python) chamam do mesmo jeito.
3. **A implementação do bot fica adiada** até haver uma conta de WhatsApp para testar. Até lá, tudo
   que não precisa do WhatsApp (parser de mensagem, regras de lance, abertura e fechamento por horário,
   moderação) pode ser escrito e testado com eventos simulados, sem conectar.
4. O bootstrap do bot (`BOOTSTRAP.md`) passa a considerar Python (pergunta 5, "stack preferida"
   respondida aqui).

## Consequências

- **Sessão e criptografia.** O neonize persiste a sessão do dispositivo por conta própria
  (SQLite ou PostgreSQL), em tabelas do whatsmeow. Isso **não é** a tabela `whatsapp_sessions`
  criptografada da ADR 0007. A decisão a tomar no bootstrap: (a) Postgres dedicado ao bot (schema
  ou banco próprio, com role própria e disco criptografado) e `whatsapp_sessions` guarda só o estado
  de conexão; ou (b) cifrar o arquivo SQLite da sessão e guardá-lo em `whatsapp_sessions`. Em ambos,
  a credencial **não** pode ser lida pelo administrador da plataforma (ADR 0012) nem aparecer em log.
- **Identificador do participante (risco).** O WhatsApp passou a expor **LID** (identificador
  mascarado) em vez do número em grupos. O helper `jid_is_lid` existe por isso. O modelo atual
  identifica o cliente pelo **telefone** (`customers.phone`, único por loja). Se um participante
  chegar só com LID, o bot **não terá o telefone**. Precisamos validar com conta real e, se for o caso,
  guardar o LID (`customers.whatsapp_lid`) e resolver o telefone quando possível. Registrado como
  risco em aberto; enquanto isso o schema não muda.
- **Execução.** O bot roda como processo Python próprio, uma sessão por loja, no mesmo Postgres
  (role própria, ADR 0011). O consumo de memória por loja (150 a 300 MB estimados para Baileys)
  precisa ser medido de novo.
- **Documentos a manter coerentes:** ADR 0007 (nota de status), `ARCHITECTURE.md` do shared e do
  Backend, `STACK.md` do Backend, issues do bot.
