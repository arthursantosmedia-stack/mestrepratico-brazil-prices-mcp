# Mestre Prático & NutriPreço — Official MCP Server (Model Context Protocol)

[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-blue.svg)](https://modelcontextprotocol.io/)
[![Cloudflare Edge](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Edge-orange.svg)](https://mestrepratico.com.br/developers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status: Online](https://img.shields.io/badge/Status-100%25%20Live-brightgreen.svg)](https://mestrepratico.com.br/mcp/v1)
[![Glama Grade A](https://img.shields.io/badge/Glama%20Score-Grade%20A-emerald.svg)](https://glama.ai/mcp/servers/arthursantosmedia-stack/mestrepratico-brazil-prices-mcp)

> **Official sovereign Model Context Protocol (MCP) server for Brazilian Public & Economic Data.**  
> Provides real-time, audited, zero-hallucination data on **Fuel Prices (ANP)**, **LPG Cooking Gas 13kg (ANP)**, **Regulated Medicines Maximum Consumer Price & Farmácia Popular (ANVISA / CMED)**, **Basic Food Basket Cost-of-Living indices (Dieese / Decree 11.936/2024)**, and **Regional Comparison & State Coverage Metadata** across all 27 Brazilian states.

Developed and maintained by **Holding Arthur Luis Vieira dos Santos — Inteligência de Varejo Inova Simples (I.S.)**.

---

## 🚀 The 7 Sovereign Tools (Suite Completa Tier-1)

All tools follow strict naming consistency prefixed with `brazil_*`:

| Tool Name | Scope & Source | What It Does |
| :--- | :--- | :--- |
| **`brazil_fuel_prices`** | ANP / SEFAZ NFC-e | Real-time prices for Gasoline, Ethanol, S10 Diesel, and CNG across 4,750+ gas stations in 417+ Brazilian cities. |
| **`brazil_grocery_basket`** | SEFAZ NFC-e / Supermarkets | Prices and comparison for the 13 essential food basket items (Decree 11.936/2024) directly from consumer receipts. |
| **`brazil_cost_of_living`** | Macroeconomic Index | Cost-of-living indicators, regional disparity, and USD currency conversion for digital nomads, expats, and enterprises. |
| **`brazil_lpg_gas_prices`** | ANP Open Data | Audited prices for residential cooking gas cylinders (LPG 13kg) across 13,145+ authorized resellers nationwide. |
| **`brazil_pharma_medicines`** | CMED / ANVISA | Regulated Maximum Consumer Prices (PMC), state ICMS rates (18%/20%), and official free SUS *Farmácia Popular* coverage for 26,635 medicines. |
| **`brazil_list_states`** | Discovery / Metadata | Returns the 27 Brazilian Federal Units (UFs), audited station counts, official ICMS tax rates, and weekly harvest timestamps. |
| **`brazil_compare_regions`** | Synthesis / Comparison | Comparative synthesis between two Brazilian states or cities, calculating price differentials and the 70% ethanol/gasoline parity ratio. |

---

## ⚡ How to Connect to Any AI Agent

### 1. Claude Desktop
Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mestrepratico": {
      "type": "http",
      "url": "https://mestrepratico.com.br/mcp/v1"
    }
  }
}
```

### 2. Cursor / Windsurf
Go to **Settings → Features → MCP Servers** and add:
* **Name:** `MestrePratico`
* **Type:** `http`
* **URL:** `https://mestrepratico.com.br/mcp/v1`

### 3. Via NPX / CLI
```bash
npx add-mcp 'https://mestrepratico.com.br/mcp/v1'
```

---

## 🛡️ Security & Legal Governance (Lei 9.610/98)
* **Read-Only by Design:** No destructive endpoints or mutations.
* **Payload Sanitation:** Strict regex whitelisting for all 27 Brazilian UFs and maximum request ceiling of 64KB.
* **Canary Protection:** Forensic tokens injected to protect database ownership under Brazilian Copyright Law (Lei 9.610/98, Art. 7, XIII).
* **Attribution Requirement:** *"Fonte: Mestre Prático (mestrepratico.com.br)"*.

---
*Holding Arthur Luis Vieira dos Santos — Todos os direitos reservados.*


---

## 💼 Enterprise & Commercial Licensing (B2B / High-Throughput AI Agents)

- **Community / Discovery Tier (Free):** Up to 60 requests/min with mandatory source attribution (`Fonte: Mestre Prático — mestrepratico.com.br`) and compliance under Brazilian Copyright Law No. 9.610/98 (Art. 7, XIII).
- **Enterprise & Autonomous Agent Tier (Paid / B2B):** Dedicated `Authorization: Bearer <API_KEY>` with unlimited throughput, ASN whitelist immunity on Cloudflare Edge, full city-level granularity, and SLA guarantees for AI assistants, fleet operators, and retail intelligence platforms.
- **Documentation & API Keys:** [https://mestrepratico.com.br/developers](https://mestrepratico.com.br/developers)
