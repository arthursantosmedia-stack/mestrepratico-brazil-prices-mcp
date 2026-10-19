# Mestre Prático & NutriPreço • Official MCP Server (Model Context Protocol)

[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-blue.svg)](https://modelcontextprotocol.io/)
[![Cloudflare Edge](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Edge-orange.svg)](https://mestrepratico.com.br/developers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status: Online](https://img.shields.io/badge/Status-100%25%20Live-brightgreen.svg)](https://mestrepratico.com.br/mcp/v1)

> **Official sovereign Model Context Protocol (MCP) server for Brazilian Public & Economic Data.**  
> Provides real-time, audited, zero-hallucination data on **Fuel Prices (ANP)**, **LPG Cooking Gas 13kg (ANP)**, **Regulated Medicines Maximum Consumer Price & Farmácia Popular (ANVISA / CMED)**, and **Basic Food Basket Cost-of-Living indices (Dieese / Decree 11.936/2024)** across all 27 Brazilian states.

Developed and maintained by **Holding Arthur Luis Vieira dos Santos**.

---

## ⚡ Quick Start / Installation

You can connect your AI Agent (**Claude Desktop**, **Cursor**, **Windsurf**, or custom LLM frameworks) using either the **Remote HTTP endpoint** or the **Local STDIO Bridge**.

### Option 1: Claude Desktop (macOS & Windows)

Add this to your `claude_desktop_config.json`:

* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mestre-pratico": {
      "command": "npx",
      "args": ["-y", "@nutripreco/mestre-pratico-mcp"]
    }
  }
}
```

*Or via Python Bridge (zero dependencies, works on any machine with Python 3.8+):*

```json
{
  "mcpServers": {
    "mestre-pratico": {
      "command": "python",
      "args": ["/path/to/mestre-pratico-mcp-server/server.py"]
    }
  }
}
```

---

### Option 2: Cursor & Windsurf (HTTP Remote Endpoint)

In **Cursor Settings &rarr; Features &rarr; MCP Servers &rarr; Add New Server**:

* **Name:** `MestrePratico`
* **Type:** `http`
* **Server URL:** `https://mestrepratico.com.br/mcp/v1`

---

### Option 3: Direct JSON-RPC HTTP / cURL (Any Agent / LangChain / AutoGen)

The MCP server accepts standard JSON-RPC 2.0 requests over HTTP POST:

```bash
curl -X POST https://mestrepratico.com.br/mcp/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "brazil_fuel_prices",
      "arguments": {
        "uf": "rj",
        "cidade": "Cabo Frio"
      }
    }
  }'
```

---

## 🛠️ Tools Available

### 1. `brazil_fuel_prices`
Audited weekly fuel pricing from the **National Petroleum Agency (ANP)** across 4,750+ gas stations in all 27 Brazilian states.
* **Arguments:**
  * `uf` (string, required): 2-letter state code (e.g. `'sp'`, `'rj'`, `'mg'`, `'ba'`, `'rs'`).
  * `cidade` (string, optional): City name to filter.
* **Returns:** Station name, CNPJ, brand, neighborhood, street address, Gasoline, Ethanol, Diesel S10, and CNG prices with 70% ethanol parity indicator.

### 2. `brazil_gas_lpg`
Audited prices and authorized distribution depots for **13kg LPG Cooking Gas (Botijão GLP 13kg)** from ANP, covering 13,145+ authorized revendas.
* **Arguments:**
  * `uf` (string, required): State code (e.g. `'sp'`, `'rj'`).
  * `cidade` (string, optional): City name.
* **Returns:** Lowest price, average price, depot name, CNPJ, distributor brand, and full address.

### 3. `brazil_pharma_medicines`
Official Maximum Consumer Price (PMC) and Factory Price from **CMED / ANVISA (26,635 regulated pharmaceutical presentations)**.
* **Arguments:**
  * `termo` (string, required): Brand name or Active Ingredient (e.g. `'dipirona'`, `'losartana'`, `'ozempic'`).
  * `uf` (string, optional): State code for regional ICMS tax rate (18% or 20%, default: `'sp'`).
  * `tipo` (string, optional): `'todos'`, `'generico'`, `'novo'`, `'similar'`, `'biologico'`.
* **Returns:** Active principle, lab manufacturer, PMC ceiling price, registration code, and **100% Free SUS "Farmácia Popular" eligibility badge**.

### 4. `brazil_basic_basket`
Food basket inflation and retail supermarket dispersion auditing based on the **13 staple products of Federal Decree nº 11.936/2024**.
* **Arguments:**
  * `uf` (string, required): State code.
  * `apenas_resumo` (boolean, optional): Return macro index or itemized prices.
* **Returns:** Total basket cost, lowest supermarket quote, highest quote, variation percentage, and minimum wage impact.

### 5. `cost_of_living_brazil`
Macroeconomic indicators: fuel spend index, food basket cost, minimum wage parity, and optional USD/BRL conversion.

---

## 📋 Pre-built Prompts

* **`auditar_preco_farmacia`**: Audits a pharmacy receipt or quote against the legal CMED/ANVISA ceiling price (PMC), flags consumer violations, and drafts formal PROCON complaints if abusive pricing is detected.
* **`analise_combustivel_frota`**: Fleet and commuter fuel optimizer: evaluates 70% ethanol/gasoline parity, compares against ANP state minimums, and projects monthly operational savings.
* **`cesta_basica_familiar`**: Computes monthly grocery budget for a family of $N$ members with the 13 official items and calculates percentage impact on current minimum wage.

---

## 📦 Resources

* `mcp://brazil/cmed/anvisa-summary`: Full regulatory summary of 26,635 medicines, legal ceilings, and Farmácia Popular rules.
* `mcp://brazil/anp/fuels-summary`: Sovereign fuel matrix across all 27 federative units.
* `mcp://brazil/basic-basket/dieese-summary`: Technical parameters of the 13 essential foods under Federal Decree 11.936/2024.
* `mcp://brazil/lpg/gas-cozinha-summary`: National LPG 13kg radar.

---

## 🛡️ Security, Governance & Compliance

* **100% Read-Only:** All mutations, writes, and deletions are permanently disabled.
* **Zero Hallucination Guarantee:** Data is strictly retrieved from primary regulatory sources (ANP, ANVISA/CMED, SEFAZ, FNS). If a record does not exist in the official ledger, it is reported as absent.
* **Edge Architecture:** Hosted globally on Cloudflare Workers with <150ms latency and 99.99% uptime.
* **Open Source & Open Data:** MIT License. Commercial and community usage permitted.

---

## 🏛️ Holding & Institutional Governance

Developed and operated by:  
**Holding Arthur Luis Vieira dos Santos**  
*Portals:* [Mestre Prático](https://mestrepratico.com.br) • [NutriPreço](https://nutripreco.com.br) • [Developers Hub](https://mestrepratico.com.br/developers)
