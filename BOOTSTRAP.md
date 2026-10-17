# Bootstrap deste repositório

> ⚠️ **Este arquivo é temporário.** Ele existe apenas até o setup inicial
> deste repositório (recém-criado a partir do template `docs/shared`) estar
> completo. A última etapa do processo descrito aqui é **apagar este
> arquivo em um commit próprio**, separado das demais mudanças. Se você
> está lendo este arquivo e o setup já foi concluído, ele não deveria mais
> existir — se existir, trate como um erro de processo, não como algo a
> seguir.

## Para quem está executando este bootstrap (humano ou agente de IA)

Não gere nenhum conteúdo de `ARCHITECTURE.md`, `GLOSSARY.md` ou qualquer
outro artefato deste repositório até que **todas** as perguntas abaixo
tenham sido respondidas pelo humano responsável pelo projeto. Este roteiro
é uma entrevista, não um formulário a preencher sozinho — não infira ou
invente respostas.

## Roteiro de perguntas (nesta ordem)

1. **Nome do projeto.** Como o projeto (o produto/sistema como um todo,
   não um repositório específico) se chama?

2. **Repositórios consumidores.** Quais repositórios vão consumir este
   `docs/shared`?
   - Qual é o repositório de backend? (nome completo `org/repo`)
   - Qual é o repositório de frontend? (nome completo `org/repo`)
   - Existem microservices? Se sim, quais, com seus nomes completos
     `org/repo` e uma frase sobre a responsabilidade de cada um?

3. **Termos de domínio/negócio.** Quais são os termos de negócio
   relevantes que devem entrar no `GLOSSARY.md`? Para cada termo, coletar:
   - o termo como o time fala no dia a dia;
   - a definição de negócio (sem jargão técnico);
   - se há um nome diferente usado no código (campo de API, variável), qual
     é;
   - em quais repositórios esse termo aparece.

## O que gerar/ajustar ao final, nesta ordem exata

Depois que as três perguntas acima tiverem sido respondidas:

1. **`ARCHITECTURE.md`** — preencher a visão geral, a tabela de
   repositórios e, principalmente, o diagrama Mermaid C4 (nível de
   Contexto) com os sistemas e atores reais coletados na pergunta 2.
2. **`GLOSSARY.md`** — preencher a tabela de termos com o que foi coletado
   na pergunta 3.
3. **Configuração dos nomes dos repositórios de destino em
   `.github/workflows/notify-consumers.yml`** — substituir os placeholders
   `SUA-ORG/SEU-BACKEND` etc. na matriz `repo` pelos repositórios reais
   coletados na pergunta 2.
4. **`AGENTS.md` real** — reescrever seguindo a estrutura que já está no
   arquivo (a seção "Se este repositório foi criado a partir do template"
   deixa de fazer sentido uma vez que o setup terminou; ajustar o texto
   para refletir que o setup já foi concluído e apontar diretamente para
   `ARCHITECTURE.md`, `docs/adr/` e `GLOSSARY.md`).
5. **Apagar este `BOOTSTRAP.md`**, em um commit separado dos anteriores,
   com uma mensagem como `chore: remove BOOTSTRAP.md after initial setup`.

Cada um dos passos 1-4 pode (e deve) ser um commit próprio, para manter o
histórico legível. O passo 5 é sempre o último e sempre isolado.
