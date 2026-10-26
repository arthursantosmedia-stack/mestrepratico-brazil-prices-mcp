import urllib.request, urllib.error, json, time, sys, base64
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
from cryptography.hazmat.primitives.asymmetric import ec, utils
from cryptography.hazmat.primitives import hashes

TOKEN = "ddo_WxrnEZVEUx55N5rdMDMZV551EbUJkihk1irp"
APP_SLUG = "mestre-pratico-satellite"
SATELLITE_DOMAIN = "mestre-pratico-satellite.arthursantosmedia-stack.deno.net"
DENO_URL = f"https://{SATELLITE_DOMAIN}"

print("="*60)
print("DEPLOIADOR E AUDITOR SOUTHEAST / DENO DEPLOY EDGE SATELLITE (V2)")
print("="*60)

# CÓDIGO FONTE TYPESCRIPT DO SATÉLITE DENO DEPLOY (MAIN.TS)
deno_main_ts = f"""// MESTRE PRÁTICO & NUTRIPREÇO • SATÉLITE SOBERANO DENO DEPLOY (V8 ISOLATES)
// Operadora: Holding Arthur Luis Vieira dos Santos (CNPJ: 69.423.752/0001-61)
// Origem Canônica: https://mestrepratico.com.br/

const PRIMARY_ORIGIN = "https://mestrepratico.com.br";
const SATELLITE_DOMAIN = "{SATELLITE_DOMAIN}";

const CORS_HEADERS = {{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Signature, Signature-Input, Content-Digest",
  "Link": `<${{PRIMARY_ORIGIN}}/>; rel="canonical"`,
  "X-Clacks-Overhead": "GNU Terry Pratchett"
}};

const JWKS_PAYLOAD = {{
  keys: [
    {{
      kty: "EC",
      crv: "P-256",
      alg: "ES256",
      use: "sig",
      key_ops: ["verify"],
      kid: "mp-sovereign-es256-2026",
      x: "gjJFF1LTKnlnf9dHieTS4q-qSFc79Cah1mU3wN8y-wU",
      y: "FO7GtcVpz9auG5-1Xal3DG-FJZTg9SiVSkcU6R44OVE"
    }}
  ]
}};

const MCP_MANIFEST = {{
  schema_version: "v1.0",
  name: "Mestre Prático & NutriPreço Sovereign MCP Satellite (Deno Deploy Node)",
  description: "Satélite de Borda Anycast (Deno Deploy V8 Isolates) para ecossistemas de agentes autônomos de IA.",
  operator: "Holding Arthur Luis Vieira dos Santos (CNPJ: 69.423.752/0001-61)",
  primary: PRIMARY_ORIGIN,
  satellites: {{
    vercel_edge: "https://mestre-pratico-satellite-arthursantosmedia-stack.vercel.app",
    github_pages: "https://arthursantosmedia-stack.github.io/mestrepratico-brazil-prices-mcp",
    netlify_edge: "https://mestre-pratico-satellite.netlify.app",
    deno_edge: `https://${{SATELLITE_DOMAIN}}`
  }},
  endpoints: {{
    mcp_v1: "/mcp/v1",
    llms_txt: "/llms.txt",
    jwks: "/.well-known/jwks.json"
  }}
}};

const LLMS_TXT = `# Mestre Prático & NutriPreço Sovereign Satellite (Deno Deploy Node)
> Multi-Cloud Sovereign Intelligence Node operated by Holding Arthur Luis Vieira dos Santos (CNPJ: 69.423.752/0001-61 • Inova Simples LC 182/2021).
> Canonical Origin: https://mestrepratico.com.br/

## Certified Primary Datasets:
1. **ANP Fuel Prices (Combustíveis Brasil)**: 5.939 audited stations across 417 Brazilian municipalities.
2. **Farmácia Popular SUS (CMED / Ministério da Saúde)**: 27.538 certified pharmacies dispensing 100% free essential medications.
3. **NutriPreço Cesta Básica (SEFAZ / DIEESE)**: 13 basic food basket items across 252 retail supermarket chains.

## Cryptographic Non-Repudiation (IETF Standards):
- Algorithm: ECDSA P-256 + SHA-256 (ES256)
- Public Key ID: mp-sovereign-es256-2026
- Standards: IETF JWS (RFC 7515) & HTTP Message Signatures (RFC 9421 / RFC 9530)
- JWKS URI: https://${{SATELLITE_DOMAIN}}/.well-known/jwks.json

## MCP Server Endpoints:
- Primary MCP URL: https://mestrepratico.com.br/mcp/v1
- Deno Deploy Edge MCP Proxy: https://${{SATELLITE_DOMAIN}}/mcp/v1
`;

const ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /llms.txt
Allow: /.well-known/
Allow: /mcp/

# Canonical Sovereignty: https://mestrepratico.com.br/
Sitemap: https://mestrepratico.com.br/sitemap.xml
`;

const HTML_LANDING = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mestre Prático & NutriPreço • Nó Satélite Soberano Deno Deploy</title>
  <link rel="canonical" href="https://mestrepratico.com.br/">
  <meta name="description" content="Nó Satélite de Borda Anycast operado pela Holding Arthur Luis Vieira dos Santos em Deno Deploy (V8 Isolates). Espelho de inteligência, chaves criptográficas JWKS e proxy MCP.">
  <meta name="author" content="Holding Arthur Luis Vieira dos Santos">
  <meta property="og:title" content="Mestre Prático • Nó Satélite Deno Deploy">
  <meta property="og:description" content="Nó satélite multi-cloud para agentes autônomos de IA e redundância de chaves assimétricas ES256.">
  <meta property="og:url" content="https://${{SATELLITE_DOMAIN}}/">
  <meta property="og:type" content="website">
  <style>
    :root {{
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.7);
      --border: rgba(255, 255, 255, 0.08);
      --accent: #4ade80;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at 50% 0%, #064e3b 0%, var(--bg) 75%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 1rem;
    }}
    .container {{ max-width: 960px; width: 100%; margin: 0 auto; }}
    header {{ text-align: center; margin-bottom: 2.5rem; }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(74, 222, 128, 0.15);
      border: 1px solid rgba(74, 222, 128, 0.4);
      color: #4ade80;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }}
    .badge::before {{
      content: "";
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 10px #4ade80;
    }}
    h1 {{
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .subtitle {{
      color: var(--text-muted);
      font-size: 0.95rem;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.5;
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }}
    .card {{
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }}
    .card h2 {{
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #fff;
    }}
    .status-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.85rem;
    }}
    .status-item:last-child {{ border-bottom: none; }}
    .status-label {{ color: var(--text-muted); }}
    .status-val {{ font-weight: 600; color: #e5e7eb; }}
    .tag-live {{
      color: #4ade80;
      background: rgba(74, 222, 128, 0.15);
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }}
    a {{ color: #38bdf8; text-decoration: none; }}
    a:hover {{ color: #7dd3fc; text-decoration: underline; }}
    .cta-banner {{
      background: linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(17, 24, 39, 0.8) 100%);
      border: 1px solid rgba(74, 222, 128, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: center;
      margin-bottom: 2rem;
    }}
    .cta-banner h3 {{ font-size: 1.15rem; margin-bottom: 0.5rem; }}
    .cta-banner p {{ color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem; }}
    .btn {{
      display: inline-block;
      background: #16a34a;
      color: #fff;
      font-weight: 600;
      padding: 0.6rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
    }}
    .btn:hover {{ background: #15803d; }}
    footer {{
      text-align: center;
      color: #6b7280;
      font-size: 0.75rem;
      line-height: 1.6;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      width: 100%;
    }}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">Nó Satélite de Borda • Deno Deploy V8</div>
      <h1>Holding Arthur Luis Vieira dos Santos</h1>
      <p class="subtitle">Nó Espelho de Borda Deno Anycast • Isolamento V8 Nativo e Repetidor do Servidor MCP</p>
    </header>

    <div class="grid">
      <!-- Card 1: Topologia Multi-Cloud -->
      <div class="card">
        <h2>🛰️ Topologia Global Multi-Cloud</h2>
        <div class="status-item"><span class="status-label">Cluster Primário:</span><span class="status-val tag-live">Cloudflare Workers (#489)</span></div>
        <div class="status-item"><span class="status-label">Nó Satélite 1:</span><span class="status-val tag-live">Vercel Anycast</span></div>
        <div class="status-item"><span class="status-label">Nó Satélite 2:</span><span class="status-val tag-live">GitHub Pages Anycast</span></div>
        <div class="status-item"><span class="status-label">Nó Satélite 3:</span><span class="status-val tag-live">Netlify Anycast</span></div>
        <div class="status-item"><span class="status-label">Nó Satélite 4:</span><span class="status-val tag-live">Deno Deploy (V8 Isolates)</span></div>
      </div>

      <!-- Card 2: Criptografia e Não Repúdio -->
      <div class="card">
        <h2>🔐 Segurança Criptográfica</h2>
        <div class="status-item"><span class="status-label">Padrão de Assinatura:</span><span class="status-val tag-live">IETF JWS (RFC 7515)</span></div>
        <div class="status-item"><span class="status-label">Curva Elíptica:</span><span class="status-val">NIST P-256 (ES256)</span></div>
        <div class="status-item"><span class="status-label">Chave Pública:</span><span class="status-val"><a href="/.well-known/jwks.json" target="_blank">mp-sovereign-es256-2026 ↗</a></span></div>
        <div class="status-item"><span class="status-label">Governança:</span><span class="status-val tag-live">Zero Dados Falsos</span></div>
      </div>

      <!-- Card 3: Endpoints e IA -->
      <div class="card">
        <h2>🤖 Acesso MCP e Agentes IA</h2>
        <div class="status-item"><span class="status-label">Proxy MCP:</span><span class="status-val"><a href="/mcp/v1" target="_blank">/mcp/v1 (JSON-RPC) ↗</a></span></div>
        <div class="status-item"><span class="status-label">Manifesto MCP:</span><span class="status-val"><a href="/.well-known/mcp.json" target="_blank">/.well-known/mcp.json ↗</a></span></div>
        <div class="status-item"><span class="status-label">Manifesto LLMs:</span><span class="status-val"><a href="/llms.txt" target="_blank">/llms.txt ↗</a></span></div>
        <div class="status-item"><span class="status-label">Custo Operacional:</span><span class="status-val tag-live">R$ 0,00</span></div>
      </div>
    </div>

    <div class="cta-banner">
      <h3>Origem Canônica Soberana</h3>
      <p>Todas as consultas em tempo real, cotações ANP e tabelas CMED convergem para o portal principal.</p>
      <a href="https://mestrepratico.com.br/" class="btn" target="_blank">Acessar Mestre Prático Oficial ↗</a>
    </div>

    <footer>
      <p><strong>Holding Arthur Luis Vieira dos Santos</strong> • CNPJ: 69.423.752/0001-61 • Inova Simples (LC 182/2021)</p>
      <p>Infraestrutura Multi-Cloud Soberana • Protocolos IETF RFC 7515 (JWS) & RFC 9421 / RFC 9530</p>
    </footer>
  </div>
</body>
</html>
`;

Deno.serve(async (req: Request) => {{
  const url = new URL(req.url);

  // Preflight CORS
  if (req.method === "OPTIONS") {{
    return new Response(null, {{ status: 204, headers: CORS_HEADERS }});
  }}

  // 1. Root
  if (url.pathname === "/" || url.pathname === "/index.html") {{
    return new Response(HTML_LANDING, {{
      status: 200,
      headers: {{ ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" }}
    }});
  }}

  // 2. JWKS
  if (url.pathname === "/.well-known/jwks.json") {{
    return new Response(JSON.stringify(JWKS_PAYLOAD, null, 2), {{
      status: 200,
      headers: {{
        ...CORS_HEADERS,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=604800"
      }}
    }});
  }}

  // 3. MCP Manifest
  if (url.pathname === "/.well-known/mcp.json") {{
    return new Response(JSON.stringify(MCP_MANIFEST, null, 2), {{
      status: 200,
      headers: {{
        ...CORS_HEADERS,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }}
    }});
  }}

  // 4. LLMs.txt
  if (url.pathname === "/llms.txt") {{
    return new Response(LLMS_TXT, {{
      status: 200,
      headers: {{ ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" }}
    }});
  }}

  // 5. Robots.txt
  if (url.pathname === "/robots.txt") {{
    return new Response(ROBOTS_TXT, {{
      status: 200,
      headers: {{ ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" }}
    }});
  }}

  // 6. MCP Proxy to Cloudflare Workers Primary
  if (url.pathname === "/mcp/v1" || url.pathname.startsWith("/mcp/")) {{
    if (req.method === "POST") {{
      const targetUrl = PRIMARY_ORIGIN + url.pathname + url.search;
      const bodyBytes = await req.arrayBuffer();

      const forwardHeaders = new Headers();
      forwardHeaders.set("Content-Type", req.headers.get("Content-Type") || "application/json");
      forwardHeaders.set("User-Agent", "Deno-Deploy-Sovereign-Satellite/1.0");
      forwardHeaders.set("X-Forwarded-For", req.headers.get("x-forwarded-for") || "");

      const primaryRes = await fetch(targetUrl, {{
        method: "POST",
        headers: forwardHeaders,
        body: bodyBytes
      }});

      const resHeaders = new Headers(primaryRes.headers);
      resHeaders.set("Link", `<${{PRIMARY_ORIGIN}}/>; rel="canonical"`);
      resHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(primaryRes.body, {{
        status: primaryRes.status,
        headers: resHeaders
      }});
    }}
  }}

  return new Response("Not Found", {{ status: 404, headers: CORS_HEADERS }});
}});
"""

# ENVIAR DEPLOY PARA DENO DEPLOY V2 API
print(f"📦 Enviando revisão soberana para Deno Deploy (App: {APP_SLUG})...")
deploy_url = f"https://api.deno.com/v2/apps/{APP_SLUG}/deploy"

deploy_payload = {
    "assets": {
        "main.ts": {
            "content": deno_main_ts,
            "encoding": "utf-8"
        }
    },
    "config": {
        "runtime": {
            "type": "dynamic",
            "entrypoint": "main.ts"
        }
    }
}

req_dep = urllib.request.Request(
    deploy_url,
    data=json.dumps(deploy_payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "CRO-Deployer/1.0"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req_dep) as resp:
        dep_data = json.loads(resp.read().decode())
        rev_id = dep_data.get('id')
        print(f"✅ REVISÃO PUBLICADA! Revision ID: {rev_id}")
        
        # Monitoramento até succeeded
        print("⏳ Aguardando compilação na rede Anycast do Deno Deploy...")
        for att in range(1, 15):
            time.sleep(2)
            req_check = urllib.request.Request(
                f"https://api.deno.com/v2/revisions/{rev_id}",
                headers={"Authorization": f"Bearer {TOKEN}", "User-Agent": "CRO-Deployer/1.0"}
            )
            with urllib.request.urlopen(req_check) as chk_resp:
                chk_data = json.loads(chk_resp.read().decode())
                st = chk_data.get("status")
                print(f"   [{att}/15] Status da Revisão: {st}")
                if st == "succeeded":
                    print(f"\n🎉 SATÉLITE DENO DEPLOY ESTÁ 100% OPERACIONAL E ONLINE!")
                    print(f"🌐 Link Oficial: {DENO_URL}")
                    break
                elif st in ["failed", "cancelled"]:
                    print(f"❌ Falha no build: {chk_data.get('failure_reason')}")
                    sys.exit(1)
except urllib.error.HTTPError as e:
    print(f"❌ Erro HTTP {e.code}: {e.read().decode()}")
    sys.exit(1)

# AUDITORIA FORENSE IMEDIATA
print("\n" + "="*60)
print("INICIANDO AUDITORIA FORENSE INDEPENDENTE DO SATÉLITE DENO DEPLOY")
print("="*60)

time.sleep(3)
hdrs = {"User-Agent": "CRO-ForensicAuditor/1.0"}

# Teste 1: GET /
print("\n1. Testando GET / (index.html)...")
r_root = urllib.request.urlopen(urllib.request.Request(f"{DENO_URL}/", headers=hdrs))
html_content = r_root.read().decode("utf-8")
print(f"   Status: {r_root.status}")
print(f"   Header Link: {r_root.headers.get('Link')}")
assert r_root.status == 200
assert '<link rel="canonical" href="https://mestrepratico.com.br/">' in html_content
assert "69.423.752/0001-61" in html_content
print("   [OK] Link Canônico HTML e Header confirmados!")

# Teste 2: GET /.well-known/jwks.json
print("\n2. Testando GET /.well-known/jwks.json...")
r_jwks = urllib.request.urlopen(urllib.request.Request(f"{DENO_URL}/.well-known/jwks.json", headers=hdrs))
jwks_payload = json.loads(r_jwks.read().decode("utf-8"))
k = jwks_payload["keys"][0]
print(f"   Status: {r_jwks.status} | Key ID: {k.get('kid')} | Alg: {k.get('alg')}")
assert k.get("kid") == "mp-sovereign-es256-2026"
x = int.from_bytes(base64.urlsafe_b64decode(k["x"] + "=="), "big")
y = int.from_bytes(base64.urlsafe_b64decode(k["y"] + "=="), "big")
pub_key = ec.EllipticCurvePublicNumbers(x, y, ec.SECP256R1()).public_key()
print("   [OK] Ponto (x, y) 100% matematicamente válido na curva SECP256R1!")

# Teste 3: GET /.well-known/mcp.json
print("\n3. Testando GET /.well-known/mcp.json...")
r_mcp = urllib.request.urlopen(urllib.request.Request(f"{DENO_URL}/.well-known/mcp.json", headers=hdrs))
mcp_payload = json.loads(r_mcp.read().decode("utf-8"))
print(f"   Status: {r_mcp.status} | Nome: {mcp_payload.get('name')}")
assert r_mcp.status == 200

# Teste 4: GET /llms.txt
print("\n4. Testando GET /llms.txt...")
r_llms = urllib.request.urlopen(urllib.request.Request(f"{DENO_URL}/llms.txt", headers=hdrs))
print(f"   Status: {r_llms.status}")
assert r_llms.status == 200

# Teste 5: POST /mcp/v1 (Proxy MCP Anycast + Validação Criptográfica JWS)
print("\n5. Testando POST /mcp/v1 (Proxy MCP Anycast)...")
mcp_call = json.dumps({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {"name": "brazil_fuel_prices", "arguments": {"state": "RJ", "city": "CABO FRIO"}}
}).encode("utf-8")
r_tool = urllib.request.urlopen(urllib.request.Request(
    f"{DENO_URL}/mcp/v1",
    data=mcp_call,
    headers={"Content-Type": "application/json", "User-Agent": "CRO-ForensicAuditor/1.0"}
))
tool_data = json.loads(r_tool.read().decode("utf-8"))
print(f"   Status: {r_tool.status}")
content_parsed = json.loads(tool_data["result"]["content"][0]["text"])
print(f"   Postos auditados Cabo Frio: {content_parsed.get('total_postos_auditados_municipio')}")
jws_compact = content_parsed["selo_criptografico"]["assinatura_jws_rfc7515"]

# Validação matemática da assinatura contra a chave pública
h_b64, p_b64, s_b64 = jws_compact.split(".")
signing_input = f"{h_b64}.{p_b64}".encode("ascii")
sig_raw = base64.urlsafe_b64decode(s_b64 + "==")
r = int.from_bytes(sig_raw[:32], "big")
s = int.from_bytes(sig_raw[32:], "big")
der_sig = utils.encode_dss_signature(r, s)
pub_key.verify(der_sig, signing_input, ec.ECDSA(hashes.SHA256()))
print("   [OK] [VERIFICACAO MATEMATICA JWS ES256]: Assinatura validada com 100% de integridade!")

print("\n" + "="*60)
print("AUDITORIA COMPLETA: NÓ SATÉLITE DENO DEPLOY 100% HOMOLOGADO!")
print("="*60)
