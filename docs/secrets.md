# Secrets do shared

> Só **nomes** e onde configurar. Nenhum valor entra neste arquivo. Os valores
> ficam no GitHub e, para guardar localmente, em `.env.secrets.local`
> (ignorado pelo git).

| Nome | Tipo | Escopo | Para quê | Como obter |
| --- | --- | --- | --- | --- |
| `CONTRACT_DISPATCH_TOKEN` | secret | repo `shared` | `notify-consumers.yml` avisa os consumidores quando o `openapi.yaml` muda. O `GITHUB_TOKEN` padrão não consegue disparar evento em outro repo | PAT fine-grained ou GitHub App com permissão de Contents (read/write) nos repositórios consumidores. Só é necessário quando houver consumidor ativo (o `frontend_web`, que ficou para depois) |

Os secrets `AUTOMATION_TOKEN` e `SONAR_TOKEN` estão descritos em
`Backend/docs/secrets.md`. O `AUTOMATION_TOKEN` precisa ter acesso de escrita
a este repositório, porque é com ele que o Backend abre o PR do contrato aqui.
