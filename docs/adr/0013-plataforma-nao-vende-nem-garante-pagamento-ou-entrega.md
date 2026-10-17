# 13. A plataforma não vende nem garante pagamento ou entrega

Data: 2026-10-17

## Status

Aceita. Complementa a [ADR 0002](0002-mvp-sem-pagamento-e-sem-envio.md).

## Contexto

A ADR 0002 tirou o gateway de pagamento e a integração de envio do MVP por
simplicidade. O design foi além e definiu a **posição da plataforma**: ela é
uma ferramenta do lojista, não parte da compra. O nome "Anti-Calote" sugeria
uma garantia que o produto não dá, e foi retirado. Afeta o texto de toda a
interface, os Termos de uso e o modelo de dados do acerto.

## Decisão

1. **A plataforma não realiza vendas e não garante pagamento nem entrega.** O
   contrato de compra é entre a loja e o comprador. Pagamento e envio são
   combinados diretamente entre eles.
2. O recurso se chama **"Acertos e cadastro de compradores"**. Não se usa
   linguagem de garantia ("anti-calote", "compra segura", "protegido") em
   nenhuma tela, e-mail, documento ou mensagem.
3. A página de acerto mostra a **chave PIX da loja** e permite o comprador
   avisar "já paguei" e anexar um comprovante opcional. A confirmação do
   pagamento é **sempre da loja**; o sistema nunca marca `PAID` sozinho.
4. A blacklist e o cadastro de compradores servem para a **loja** decidir com
   quem negocia, não como garantia da plataforma.
5. Os **Termos de uso** e a **Política de Privacidade** dizem isso de forma
   explícita e precisam de revisão jurídica antes de qualquer loja real.

## Consequências

- **Mais fácil:** sem custódia de dinheiro, sem conformidade financeira e sem
  responsabilidade por entrega. Reduz o risco jurídico e de segurança.
- **Mais difícil:** a plataforma não resolve disputa; precisa deixar isso claro
  para evitar a expectativa errada. A chave PIX da loja passa a ser dado
  exposto em página pública (ADR 0014).
- **Pendente:** como a **assinatura da própria plataforma** é cobrada (plano e
  faturas). Esta ADR e a 0002 tratam dos leilões, não disso. Decisão em aberto
  em `docs/produto.md`, seção 6.
