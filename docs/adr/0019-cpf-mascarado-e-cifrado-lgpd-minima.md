# 19. CPF mascarado na saída e cifrado no banco (LGPD mínima)

Data: 2026-10-18

## Status

Aceita, por decisão do dono (`OWNER.md`, D2). Substitui o item "retenção e exclusão" da D2 por uma
postura mínima; **não** substitui a revisão jurídica antes de abrir para lojas reais.

## Contexto

O sistema guarda CPF, telefone e endereço de compradores e consignadores. O dono avaliou que, nesta fase
(amigos testando de graça), o que importa é não expor o CPF e não deixá-lo legível no banco. Política de
retenção, exclusão de loja e textos jurídicos ficam para quando houver loja real.

## Decisão

1. **Máscara na saída.** Nenhuma resposta da API devolve o CPF inteiro: só `•••.•••.•••-NN`. Já vale em
   todas as rotas e nas funções públicas. Nunca em log.
2. **Cifrado no banco.** `customers.cpf` guarda o CPF cifrado com **AES-256-GCM** (chave `CPF_ENCRYPTION_KEY`,
   fora do banco), no formato `v1.<iv>.<tag>.<texto>`. Quem lê um backup ou o banco não vê o CPF.
3. **Colunas derivadas, sem expor o CPF:**
   - `cpf_last2`: os dois últimos dígitos, só para a máscara;
   - `cpf_key_hash`: HMAC-SHA256 dos 4 primeiros dígitos, que é a chave do consignador (ADR 0014). A
     comparação é feita pelo hash; sem a chave, 10 mil combinações não bastam para quebrar o valor.
4. A busca por CPF não existe (não há caso de uso). Telefone fica em texto (identifica o cliente no grupo).
5. **Fora desta decisão:** prazo de retenção, exclusão de dados e "excluir loja" (a exclusão LGPD do
   cliente, Backend #43, segue pendente), Política de Privacidade e revisão jurídica.

## Consequências

- **Mais seguro:** vazamento do banco ou de backup não expõe CPF; perder a chave torna o CPF ilegível,
  então a chave entra no backup separado dos dados (`docs/secrets.md`).
- **Mais difícil:** trocar a chave exige reescrever as linhas (o script `db:encrypt-cpf` cifra o que ainda está em texto; a rotação de chave fica para quando houver necessidade).
  O formato com prefixo `v1` permite trocar o algoritmo depois.
