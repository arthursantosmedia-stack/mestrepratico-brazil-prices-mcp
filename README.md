# Mestre Prático & NutriPreço — Brazil Retail, Fuel & Healthcare Price Intelligence MCP Server

[![MCP Protocol](https://img.shields.io/badge/MCP-2025--11--25-blue.svg)](https://modelcontextprotocol.io/)
[![Anthropic MCP Registry](https://img.shields.io/badge/Anthropic%20MCP%20Registry-Verified%20Active-brightgreen.svg)](https://registry.modelcontextprotocol.io/v0/servers?search=mestrepratico)
[![Glama Grade A](https://img.shields.io/badge/Glama%20Score-Grade%20A%20(4.4%2F5.0)-emerald.svg)](https://glama.ai/mcp/servers/arthursantosmedia-stack/mestrepratico-brazil-prices-mcp)
[![Small Print Verified](https://smallprint.dev/badge/mcp-registry/io.github.arthursantosmedia-stack/mestrepratico-brazil-prices-mcp.svg)](https://smallprint.dev/a/mcp-registry/io.github.arthursantosmedia-stack/mestrepratico-brazil-prices-mcp)
[![ModelScope MCP](https://img.shields.io/badge/ModelScope-Verified%20MCP-624AFF.svg)](https://modelscope.ai/mcp/servers/arthursantosmedia-stack/mestrepratico-brazil-prices-mcp)
[![Cloudflare Edge](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Edge-orange.svg)](https://mestrepratico.com.br/developers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status: Online](https://img.shields.io/badge/Status-100%25%20Live-brightgreen.svg)](https://mestrepratico.com.br/mcp/v1)

Official sovereign **Model Context Protocol (MCP)** server providing real-time audited **Fuel Prices (ANP)**, **Basic Grocery Basket Indices (SEFAZ NFC-e / Decree 11.936/2024)**, **Residential LPG Cooking Gas 13kg (ANP)**, **Regulated Pharmaceuticals & Farmácia Popular (CMED / ANVISA)**, and **Macroeconomic Cost-of-Living Synthesis** across all **27 Brazilian states and 417+ cities**.

Built and maintained by **Holding Arthur Luis Vieira dos Santos — Tecnologia e Inteligência de Varejo Inova Simples (I.S.)** (`CNPJ 69.423.752/0001-61` — [Mestre Prático](https://mestrepratico.com.br) & [NutriPreço](https://nutripreco.com.br)).

---

## 🤝 Open Governance & Continuous Calibration (The Kaizen Principle)

> **"Our First Sovereign MCP: Engineered to Evolve with the Community"**  
> This is the first Model Context Protocol server developed and published by **Holding Arthur Luis Vieira dos Santos**. Brazil's continental economy — spanning 27 federal units and 5,570 municipalities — is a living, dynamic ecosystem. We do not operate under the illusion of perfection; instead, we operate under the **Kaizen Principle**: transparent engineering, continuous active calibration, and absolute honesty with developers and autonomous AI agents.

### 🛡️ Active Maintenance Guarantee & Legal Grounding
Every macroeconomic indicator, tax rate, and regulatory ceiling returned by our 11 sovereign tools is strictly calibrated against official primary authorities:
- **National Minimum Wage:** Calibrated to **R$ 1,621.00 / month** (R$ 7.37 / hour) in accordance with Federal **Decree No. 12,797/2025** (*Decreto nº 12.797/2025*).
- **Freight & Logistics Floor:** Anchored to **ANTT Resolution No. 5,867/2020** & **Decree No. 11.936/2024** (Basic Grocery Basket composition).
- **Fuels & Cooking Gas (LPG):** Sourced from official **ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis)** regulatory surveys.
- **Pharmaceutical Ceilings:** Calibrated to **CMED (Câmara de Regulação do Mercado de Medicamentos) / ANVISA** maximum consumer price lists (PMC) and SUS Farmácia Popular coverage.

### 💡 Building in Public — How You Can Help Us Improve
If you are building AI agents, testing connectors, or auditing data accuracy across Brazilian retail and logistics:
- Found an edge-case, tax nuance, or regional variance? **Open an Issue or Pull Request** on our GitHub repository.
- Need a specialized metric, webhook trigger, or schema enhancement? Our engineering team reviews and calibrates data feeds daily.
- **Direct Technical Desk:** [`contato@mestrepratico.com.br`](mailto:contato@mestrepratico.com.br) | [`holding@mestrepratico.com.br`](mailto:holding@mestrepratico.com.br)
- **GitHub Issues:** [nutripreco-oficial/mestre-pratico-mcp-server/issues](https://github.com/nutripreco-oficial/mestre-pratico-mcp-server/issues)

---

---

> [!IMPORTANT]
> ### 📊 Architectural Note on Historical Time-Series, Multi-Lab Pharmaceutical Comparisons & Full-Horizon Datasets
> By deliberate commercial governance and intellectual property protection under **Brazilian Copyright Law No. 9.610/98 (Art. 7, XIII)**, the unauthenticated **Community / Discovery Tier** exposes **real-time spot prices (`T+0`) with curated horizon sampling** (max 3 stations / 2 LPG resellers / 3 medicines per query).
>
> **Full Historical Price Time-Series (12-to-36 month ANP/SEFAZ/CMED inflation curves), Multi-Laboratory Pharmaceutical Therapeutic Equivalence & Cross-State Price Comparisons, and Uncapped 417+ City Bulk Datasets** are fully indexed in our sovereign vault and **exclusively unlocked for Enterprise & Commercial API Licensees (`Authorization: Bearer <ENTERPRISE_API_KEY>`)**.
>
> 👉 **Instant Self-Service Pro-Forma Invoice & Enterprise API Key Provisioning:** [**https://mestrepratico.com.br/developers**](https://mestrepratico.com.br/developers)

---

## 🌐 Live Remote MCP Endpoint (Zero-Install HTTP / Edge)
- **Endpoint URL:** `https://mestrepratico.com.br/mcp/v1`
- **Transport:** Streamable HTTP (`POST /mcp/v1` JSON-RPC 2.0 & `GET /mcp/v1` discovery manifest) + Local `stdio` Bridge (`index.js` / Docker).
- **Enterprise B2B Portal & Pro-Forma Invoicing:** `https://mestrepratico.com.br/developers`

---

## 🤖 Agent-to-Agent (A2A) Layer — Full Tri-Pillar MCP Compliance

Our server is a certified **Full Tri-Pillar Model Context Protocol (MCP)** implementation providing complete cognitive agency across 3 protocol primitives:

1. **`tools` (11 Sovereign Tools):** Instant sub-100ms RPC function calling across fuel, grocery, medicines, labor-hours, electricity tariffs, freight, and taxes.
2. **`prompts` (5 Cognitive A2A Workflows):** Structured multi-step reasoning templates (`analisar_orcamento_familiar`, `auditar_viabilidade_logistica_antt`, `raio_x_tributario_reforma`, `auditar_preco_farmacia`, `analise_combustivel_frota`) that guide autonomous agents to audit, compute, and synthesize executive memos.
3. **`resources` (8 Canonical URIs):** Direct live data hydration for AI agents without prompt injection risk (`mcp://brazil/macro/bcb-series`, `mcp://brazil/energy/aneel-tariffs`, `mcp://brazil/logistics/antt-freight-table`, `mcp://brazil/tax/confaz-icms-monofasico`, etc.).

---

## 🛠️ The 11 Sovereign `brazil_*` Tools (Glama Grade A — TDQS 4.4/5.0)

All 11 tools enforce strict `brazil_*` naming consistency, JSON Schema input constraints, and official MCP `annotations` (`readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: true`):

| Tool Name | Primary Authority | Public Spot Sample (`Free Tier`) | Enterprise Unlock (`Bearer <API_KEY>`) |
| :--- | :--- | :--- | :--- |
| **`brazil_fuel_prices`** | ANP / SEFAZ NFC-e | Top 3 audited stations + state averages (Gasoline, Ethanol, Diesel S10, CNG) | Full 4,750+ stations across 417+ cities + **Weekly Historical Time-Series** |
| **`brazil_grocery_basket`** | SEFAZ NFC-e / Supermarkets | Spot regional basket total & top supermarket chains (13 essential items) | Store-by-store SKU breakdown + **Daily Historical Inflation Time-Series** |
| **`brazil_cost_of_living`** | Macroeconomic / Dieese | Single-state combined monthly food + fuel + transport index in BRL/USD | Multi-city longitudinal purchasing-power parity (PPP) & **Historical Trends** |
| **`brazil_lpg_gas_prices`** | ANP Open Data | Top 2 authorized 13kg LPG cooking gas resellers + state average/min/max | All 13,145+ resellers with neighborhood delivery spread + **Historical Series** |
| **`brazil_pharma_medicines`** | CMED / ANVISA / SUS | Up to 3 matching presentations with Factory Price (PF), PMC, and Farmácia Popular | Full 26,635+ ANVISA catalog + **Multi-Lab Generic vs. Reference Comparison & History** |
| **`brazil_list_states`** | Discovery Metadata | All 27 Brazilian UF codes, station coverage counts, ICMS tax rates, timestamps | Full municipality slug directory & real-time webhook sync metadata |
| **`brazil_purchasing_power_oracle`** | DIEESE / BACEN / IBGE / ANEEL | Minimum wage labor-hours required to purchase monthly 13-item grocery basket, 13kg LPG, fuel & 150 kWh electricity | Real purchasing power parity (PPP) by state & **Historical Labor-Hours Trend** |
| **`brazil_energy_tariffs`** | ANEEL / ANP | Homologated residential B1 electricity rates across all 27 UFs + Thermal cooking parity (GLP vs induction) | Distribution network cost-breakdown & **Seasonal Tariff Flags (Bandeiras Tarifárias)** |
| **`brazil_freight_logistics`** | ANTT / ANP | Road freight cost floor per distance/axle + Diesel S10 consumption and transport cost per kg of food | Fleet dispatch optimization & **Bulk Grain Highway Corridor Freight Curves** |
| **`brazil_tax_anatomy`** | CONFAZ / EC 132 | Constitutional tax decomposition (ICMS Monofásico vs. Net Product) across all 27 UFs | State-by-state fiscal anatomy & **Tax Reform IBS/CBS Dual-Rate Transition Analysis** |
| **`brazil_compare_regions`** | Cross-State Synthesis | Side-by-side fuel & grocery differential + 70% ethanol/gasoline parity ratio | **Multi-Sector Cross-State Comparison (including Pharma ICMS 18% vs 20% & LPG)** |

---

## 💼 Commercial Licensing & Pricing Tiers

| Tier | Throughput & Coverage | Historical Time-Series & Bulk | Monthly Investment |
| :--- | :--- | :--- | :--- |
| **1. Community / Evaluation** | Curated sample (max 3 items/call, 10 calls/window) with mandatory source attribution | Spot (`T+0`) only | **Free (`US$ 0`)** |
| **2. Commercial AI Agent / Startup** | Unlimited queries across all 417+ cities + Edge ASN Whitelist (`Authorization: Bearer`) | **12-Month Historical Time-Series + Pharma Comparator** | **US$ 490 / mo** *(or R$ 2.450/mês)* |
| **3. Enterprise / Global Platform** | Dedicated high-frequency SLA, custom webhooks, raw bulk feeds & legal indemnity | **Full 36-Month Historical Time-Series + All 7 Verticals** | **US$ 1,950 / mo** *(or R$ 9.800/mês)* |

* **Generate a Pro-Forma Invoice in 10 seconds:** [https://mestrepratico.com.br/developers](https://mestrepratico.com.br/developers)
* **Corporate Licensing Desk:** `parcerias@mestrepratico.com.br` | `holding@mestrepratico.com.br`

---

## ⚡ 1-Click Install via Smithery (Claude Desktop, Cursor, Cline)

Install automatically with a single terminal command:

```bash
npx -y @smithery/cli install @mestrepratico/brazil-prices-mcp
```

Or connect directly via remote HTTP:

## ⚡ Quick Connect (Claude Desktop, Cursor, Windsurf, Glama)

```json
{
  "mcpServers": {
    "mestrepratico-brazil": {
      "type": "http",
      "url": "https://mestrepratico.com.br/mcp/v1",
      "headers": {
        "Authorization": "Bearer YOUR_ENTERPRISE_API_KEY_OPTIONAL"
      }
    }
  }
}
```

---

## 🛡️ Security & Intellectual Property Governance
Protected by forensic Canary Tokens (`NC-CANARY-BRL-*`) under **Brazilian Copyright Law No. 9.610/98 (Art. 7, XIII)**, **Berne Convention**, and **17 U.S.C. § 1202**. Unauthorized proxy rotation, systematic scraping, or removal of source attribution (*"Fonte: Mestre Prático — mestrepratico.com.br"*) triggers automatic Edge ASN blocking (`HTTP 402/403`) and statutory liquidated damages of **US$ 100,000.00 (R$ 500.000,00)** per infringement.
