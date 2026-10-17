# 14. Superfícies públicas: vitrine, acerto do cliente e acompanhamento do consignador

Data: 2026-10-17

## Status

Aceita. Complementa a [ADR 0005](0005-cadastro-de-clientes-sob-demanda.md) (o
comprador passa a preencher os próprios dados) e a [ADR 0011](0011-row-level-security-como-segunda-barreira.md).

## Contexto

O design adicionou três superfícies **sem login**, todas com dado de terceiros:

1. **Vitrine de leilões ao vivo**, da plataforma inteira (cruza lojas).
2. **Acerto do cliente:** o comprador informa CPF e endereço, vê a chave PIX da
   loja e pode enviar um comprovante.
3. **Acompanhamento do consignador:** lances ao vivo, maior lance e estimativa
   de repasse, protegidos por uma chave de **4 dígitos do CPF**.

O desenho do consignador tem uma fragilidade já reconhecida no adendo: 4
dígitos são só 10 mil combinações, e os 4 primeiros dígitos de um CPF não são
aleatórios. O adendo deixava os limites para a "Fase 2". Como a página é
pública e mostra dado de terceiros, **isso não pode esperar**.

## Decisão

**Regras comuns a todas as páginas públicas**

1. O acesso exige um **token de alta entropia no link** (mínimo 128 bits,
   aleatório, guardado só como hash no banco). Link adivinhável não existe.
2. Os links têm **expiração** e podem ser **revogados** pela loja.
3. **Limite de tentativas e bloqueio temporário** em qualquer segredo digitado
   (chave do consignador, por exemplo), por link e por IP, desde o primeiro dia.
4. Resposta de erro **idêntica** para link inválido, expirado ou revogado.
5. **Dado mínimo:** só o que a página precisa; telefone sempre parcialmente
   oculto; nunca CPF, e-mail ou endereço de terceiros na resposta.
6. Cabeçalhos `Referrer-Policy: no-referrer` e `noindex` nas páginas com token.
7. O acesso público **não usa a sessão de nenhum usuário**: roda com um papel de
   banco próprio, restrito a **funções `SECURITY DEFINER` auditadas** que
   recebem o token e devolvem só os campos permitidos. Nenhuma política de RLS é
   afrouxada para o público.

**Vitrine**

8. Só aparecem lojas que **optaram** pela vitrine; leilões de lojas fora da
   vitrine não saem em nenhuma resposta pública.
9. "Ir para o leilão" leva ao grupo de WhatsApp da loja. O **link de convite do
   grupo é público** por consequência: a loja precisa saber disso ao ativar a
   vitrine, e a plataforma limita a taxa de leitura para dificultar coleta em
   massa.

**Acerto do cliente**

10. O formulário coleta CPF e endereço com **consentimento LGPD registrado**
    (quem, quando, versão do texto e IP). O CPF é validado no servidor.
11. O **comprovante** é upload de arquivo: tipo e tamanho validados no
    servidor, nome gerado pelo servidor, armazenamento fora da raiz pública e
    entrega só a quem tem permissão na loja.
12. O "já paguei" só **notifica a loja**. Nunca muda o estado do acerto.

**Acompanhamento do consignador**

13. O link é **por consignador e por loja** (não por carta), já que a página
    lista as outras cartas dele. A chave de 4 dígitos do CPF é um **segundo
    fator** sobre o token do link, nunca a única proteção.
14. A estimativa de repasse traz o aviso de que o valor final só vale após o
    encerramento e a confirmação da venda.
15. Sem CPF cadastrado no consignador, o link não é gerado.

## Consequências

- **Mais fácil:** a superfície pública fica pequena, auditável e com um único
  ponto de entrada no banco.
- **Mais difícil:** cada página pública é uma função de banco e uma rota com
  teste de abuso (enumeração, força bruta, token expirado). Vitrine e
  consignador não podem ser "só mais uma query".
- **Risco aceito para decisão do produto:** o link do grupo exposto na vitrine
  e a coleta de CPF por quem recebe o link do acerto.
- **Depende de decisões em aberto:** onde guardar o comprovante (disco ou
  bucket) e a revisão jurídica do texto de consentimento.
