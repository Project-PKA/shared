# 17. Localização em inglês e português; código só em inglês

Data: 2026-10-18

## Status

Aceita, por instrução do dono. Vale primeiro para o `frontend_web`, que ainda não tem código.

## Contexto

O produto é usado por lojistas brasileiros, mas o código será lido e mantido em um padrão único. O
Backend foi escrito até aqui com comentários, mensagens de erro e documentação em português.

## Decisão

1. **O frontend é localizado em inglês (`en`) e português do Brasil (`pt-BR`).** Todo texto que a
   pessoa vê passa pelo sistema de tradução; nenhum texto visível fica escrito direto no componente.
2. **No código, tudo em inglês:** nomes, comentários, mensagens de commit do frontend, chaves de
   tradução e testes. **Português só aparece na tela**, nos arquivos de tradução.
3. **O frontend traduz pelo `code` do erro, não pelo `detail`.** A API devolve `application/problem+json`
   com `code` estável (ex.: `BID_BID_TOO_LOW`); o texto em português que o Backend manda em `detail`
   não é exibido. Cada `code` tem uma chave de tradução no frontend.
4. O idioma inicial vem do navegador (`pt-BR` se for português, `en` nos demais), com troca manual
   guardada na preferência da pessoa.
5. Formatação de data, hora, número e moeda usa a localidade ativa (`Intl`), nunca texto montado à mão.
   Valores monetários chegam da API como string decimal e não perdem precisão no caminho.

## Consequências

- **Mais fácil:** o frontend não depende do idioma das mensagens do Backend; trocar ou acrescentar
  idioma é só acrescentar um arquivo de tradução.
- **Mais difícil:** todo `code` novo de erro no Backend exige uma chave nos dois idiomas no frontend.
  Mitigação: um teste no frontend que falha se algum `code` do contrato OpenAPI não tiver tradução.
- **Backend:** por decisão do dono em 2026-10-18, continua com comentários, mensagens de erro e documentação em português. A regra de "código só em inglês" vale para o frontend.
