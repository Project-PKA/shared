// Teste de integração entre os serviços do ambiente local (compose.yaml): API, banco, e-mail, frontend e bot.
//
//   docker compose up -d --build && docker compose run --rm seed
//   node scripts/smoke.mjs
//
// Outro ambiente (portas e projeto diferentes):
//   API_URL=http://localhost:8181 WEB_URL=http://localhost:3100 MAILPIT_URL=http://localhost:8125 \
//   BOT_URL=http://localhost:8182 COMPOSE_PROJECT=itest node scripts/smoke.mjs
//
// Usa os dados do seed (dono@example.com e os links de exemplo) e só altera um modelo de mensagem, que ele
// mesmo restaura. Não apaga e-mails do Mailpit. Precisa do Node 18+ e, para as checagens de banco,
// do `docker` no PATH. Sai com código 1 se algo falhar.
import { execFileSync } from 'node:child_process';

const API = process.env.API_URL ?? 'http://localhost:8081';
const WEB = process.env.WEB_URL ?? 'http://localhost:3000';
const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025';
const BOT = process.env.BOT_URL ?? ''; // vazio = pula o bot
const PROJECT = process.env.COMPOSE_PROJECT ?? 'pokemon-auction-local';
const OWNER = 'dono@example.com';
const STORE_A = '00000002-0000-4000-8000-000000000001';

// Tokens e chave do seed (Backend, src/db/seed.ts).
const SETTLEMENT_TOKEN = 'dev-settlement-link-token'.padEnd(43, 'A');
const CONSIGNOR_TOKEN = 'dev-consignor-link-token'.padEnd(43, 'C');

let failed = 0;
let passed = 0;
const results = [];

async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    results.push(`  ok   ${name}`);
  } catch (error) {
    failed += 1;
    results.push(`  FAIL ${name}\n         ${error instanceof Error ? error.message : String(error)}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function api(method, path, { token, store, body, headers = {} } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(store ? { 'x-store-id': store } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text === '' ? null : JSON.parse(text);
  } catch {
    /* corpo não é JSON */
  }
  return { status: response.status, json, text, headers: response.headers };
}

/** Pede o código de login e o lê na caixa do Mailpit (o e-mail nunca sai da máquina). */
async function login(email) {
  const since = Date.now() - 2000; // só vale e-mail novo; a caixa do Mailpit não é apagada
  const requested = await api('POST', '/v1/auth/otp/request', { body: { email } });
  expect(requested.status === 202, `pedido de código respondeu ${requested.status}`);
  let code = null;
  for (let i = 0; i < 40 && code === null; i += 1) {
    const list = await (await fetch(`${MAILPIT}/api/v1/messages`)).json();
    const found = (list.messages ?? []).find(
      (m) => m.To?.some((t) => t.Address === email) && Date.parse(m.Created) >= since,
    );
    if (found) {
      const full = await (await fetch(`${MAILPIT}/api/v1/message/${found.ID}`)).json();
      code = /\b(\d{6})\b/.exec(`${full.Text ?? ''} ${full.Subject ?? ''}`)?.[1] ?? null;
    }
    if (code === null) await new Promise((resolve) => setTimeout(resolve, 500));
  }
  expect(code !== null, 'o e-mail com o código não chegou ao Mailpit');
  const verified = await api('POST', '/v1/auth/otp/verify', { body: { email, code } });
  expect(verified.status === 200, `verificação do código respondeu ${verified.status}`);
  return verified.json.access_token;
}

function psql(sql, user = 'app', password = 'app') {
  return execFileSync(
    'docker',
    ['exec', '-e', `PGPASSWORD=${password}`, `${PROJECT}-db-1`, 'psql', '-U', user, '-d', 'app', '-tA', '-c', sql],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim();
}

// --- 1. Serviços de pé -------------------------------------------------------------------------------
await check('API: /health e /ready', async () => {
  expect((await api('GET', '/health')).status === 200, '/health não respondeu 200');
  const ready = await api('GET', '/ready');
  expect(ready.status === 200, `/ready respondeu ${ready.status} (banco/Redis fora?)`);
});

await check('Frontend responde e é uma página HTML', async () => {
  let last = 0;
  for (let i = 0; i < 60; i += 1) {
    const response = await fetch(WEB).catch(() => null);
    last = response?.status ?? 0;
    if (last === 200 && (await response.text()).includes('<html')) return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`o frontend não respondeu 200 (último: ${last}); o modo dev demora na primeira vez`);
});

await check('CORS: a API aceita a origem do frontend e recusa outra', async () => {
  const asked = (origin) =>
    fetch(`${API}/v1/auth/otp/request`, {
      method: 'OPTIONS',
      headers: { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' },
    });
  const web = new URL(WEB).origin;
  expect((await asked(web)).headers.get('access-control-allow-origin') === web, 'origem do frontend recusada');
  expect((await asked('https://evil.example')).headers.get('access-control-allow-origin') === null, 'origem alheia aceita');
});

if (BOT) {
  await check('Bot: health check responde', async () => {
    const response = await fetch(`${BOT}/health`);
    expect(response.status === 200, `bot respondeu ${response.status}`);
  });
}

// --- 2. Login e área da loja -----------------------------------------------------------------------------
let token = '';
await check('Login por código: API envia o e-mail e o Mailpit o recebe', async () => {
  token = await login(OWNER);
  expect(token.length > 20, 'token de acesso vazio');
});

await check('Sessão: /v1/me e a loja do seed', async () => {
  const me = await api('GET', '/v1/me', { token });
  expect(me.status === 200 && me.json.email === OWNER, `/v1/me respondeu ${me.status}`);
  const stores = await api('GET', '/v1/me/stores', { token });
  expect(stores.status === 200, `/v1/me/stores respondeu ${stores.status}`);
});

await check('Sem login: rota da loja responde 401', async () => {
  expect((await api('GET', '/v1/customers', { store: STORE_A })).status === 401, 'esperava 401');
});

await check('Clientes: CPF só mascarado na resposta', async () => {
  const list = await api('GET', '/v1/customers?limit=50', { token, store: STORE_A });
  expect(list.status === 200, `respondeu ${list.status}`);
  const masked = list.json.items.filter((c) => c.cpf_masked !== null);
  expect(masked.length > 0, 'o seed deveria ter clientes com CPF');
  expect(masked.every((c) => /^•••\.•••\.•••-\d{2}$/.test(c.cpf_masked)), 'máscara fora do formato');
  expect(!/(?<![\w-])(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})(?![\w-])/.test(list.text), 'um CPF inteiro apareceu na resposta');
});

await check('Acertos: sem frete no corpo e rotas de envio inexistentes', async () => {
  const list = await api('GET', '/v1/settlements?limit=5', { token, store: STORE_A });
  expect(list.status === 200 && list.json.items.length > 0, `respondeu ${list.status}`);
  expect(!('shipping_cost' in list.json.items[0]) && !('shipment' in list.json.items[0]), 'campos de frete ainda existem');
  expect((await api('GET', '/v1/shipments', { token, store: STORE_A })).status === 404, '/v1/shipments deveria sumir');
});

await check('Isolamento: loja que não é do usuário responde 403', async () => {
  const other = '00000002-0000-4000-8000-0000000000ff';
  const response = await api('GET', '/v1/customers', { token, store: other });
  expect(response.status === 403, `respondeu ${response.status}`);
});

await check('Modelos de mensagem: define, lê e restaura', async () => {
  const url = '/v1/store/message-templates/ended';
  const before = await api('GET', '/v1/store/message-templates', { token, store: STORE_A });
  expect(before.status === 200 && before.json.items.length === 9, 'esperava os 9 modelos');
  const set = await api('PUT', url, { token, store: STORE_A, body: { body: 'Encerrou! (teste)' } });
  expect(set.status === 200 && set.json.custom_body === 'Encerrou! (teste)', `PUT respondeu ${set.status}`);
  const bad = await api('PUT', url, { token, store: STORE_A, body: { body: 'oi {winner}' } });
  expect(bad.status === 422, `marcador inválido respondeu ${bad.status}`);
  const reset = await api('DELETE', url, { token, store: STORE_A });
  expect(reset.status === 200 && reset.json.custom_body === null, `DELETE respondeu ${reset.status}`);
});

// --- 3. Páginas públicas (sem login) -------------------------------------------------------------------
await check('Página pública do acerto: sem frete, CPF mascarado, sem dados internos', async () => {
  const page = await api('POST', '/v1/public/settlement', { body: { token: SETTLEMENT_TOKEN } });
  expect(page.status === 200, `respondeu ${page.status}`);
  expect(!('shipping_cost' in page.json), 'shipping_cost ainda aparece');
  expect(page.json.total_amount !== undefined && page.json.items.length > 0, 'faltam total e itens');
  expect(page.json.buyer.cpf_masked === null || /-\d{2}$/.test(page.json.buyer.cpf_masked), 'máscara inesperada');
});

await check('Consignador: chave certa (4 primeiros dígitos do CPF) abre; errada responde 404', async () => {
  const ok = await api('POST', '/v1/public/consignor', { body: { token: CONSIGNOR_TOKEN, key: '0000' } });
  expect(ok.status === 200 && Array.isArray(ok.json.cards), `chave certa respondeu ${ok.status}`);
  const wrong = await api('POST', '/v1/public/consignor', { body: { token: CONSIGNOR_TOKEN, key: '9999' } });
  expect(wrong.status === 404, `chave errada respondeu ${wrong.status}`);
});

await check('Token inventado responde 404 igual ao de um link vencido', async () => {
  const response = await api('POST', '/v1/public/settlement', { body: { token: 'x'.repeat(43) } });
  expect(response.status === 404, `respondeu ${response.status}`);
});

// --- 4. Banco (via docker) ---------------------------------------------------------------------------------
await check('Banco: CPF cifrado em repouso e sem tabela de envios', async () => {
  const total = Number(psql('SELECT count(*) FROM customers WHERE cpf IS NOT NULL'));
  const cipher = Number(psql("SELECT count(*) FROM customers WHERE cpf ~ '^v1\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$'"));
  const plain = Number(psql("SELECT count(*) FROM customers WHERE cpf ~ '^[0-9]{11}$'"));
  expect(total > 0 && cipher === total && plain === 0, `cifrados ${cipher}/${total}, legíveis ${plain}`);
  expect(psql("SELECT to_regclass('public.shipments')") === '', 'a tabela shipments ainda existe');
});

await check('Banco: o login do bot lê o necessário e não enxerga CPF nem acertos', async () => {
  const bot = (sql) => psql(sql, 'bot_api', 'bot_api_dev_password_0123456789');
  expect(Number(bot('SELECT count(*) FROM stores')) > 0, 'o bot não lista as lojas');
  for (const sql of ['SELECT cpf FROM customers', 'SELECT * FROM settlements']) {
    let denied = false;
    try {
      bot(sql);
    } catch {
      denied = true;
    }
    expect(denied, `o bot conseguiu rodar: ${sql}`);
  }
});

console.log(results.join('\n'));
console.log(`\n${passed} passaram, ${failed} falharam.`);
process.exit(failed === 0 ? 0 : 1);
