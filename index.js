#!/usr/bin/env node
/**
 * Mestre Prático & NutriPreço — Official Sovereign MCP Server (STDIO + Edge Proxy)
 * Holding Arthur Luis Vieira dos Santos
 * Connects local MCP clients and Glama Firecracker inspection containers to https://mestrepratico.com.br/mcp/v1
 */
const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const TOOLS = [
  {
    "name": "brazil_fuel_prices",
    "description": "Queries real-time audited retail fuel prices in Brazil (Regular Gasoline, Additive Gasoline, Hydrous Ethanol, Diesel S10, and CNG) sourced from Brazil's National Petroleum Agency (ANP) across 4,750+ stations in all 27 states and 417+ cities. Updated weekly with daily SEFAZ NFC-e cross-validation. Read-only operation; no authentication required for standard rate limits (60 req/min, max 50 stations returned per call). Use brazil_list_states first to discover valid state codes (uf), or brazil_compare_regions to compare averages between two states.",
    "annotations": {
      "title": "Brazil Audited Fuel Prices (ANP)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pr', 'ce', 'df'). Call brazil_list_states for all 27 valid UF codes."
        },
        "cidade": {
          "type": "string",
          "description": "Optional city name or URL slug (e.g., 'sao-paulo', 'rio-de-janeiro', 'cabo-frio', 'curitiba'). Omit to retrieve statewide summary."
        },
        "combustivel": {
          "type": "string",
          "enum": [
            "gasolina",
            "etanol",
            "diesel",
            "gnv",
            "todos"
          ],
          "description": "Fuel type filter for price ranking (default: 'todos')."
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_grocery_basket",
    "description": "Queries and compares real-time audited prices of Brazil's 13 Basic Food Basket items (rice, beans, coffee, soy oil, milk, sugar, beef, bread, butter, etc.) sourced from electronic consumer invoices (NFC-e SEFAZ) and DIEESE methodology across 59 regional hubs. Updated daily. Read-only operation; no authentication required up to 60 req/min. Use brazil_list_states to check regional coverage, brazil_cost_of_living for full household budget synthesis, or brazil_compare_regions for cross-state comparisons.",
    "annotations": {
      "title": "Brazil Basic Food Basket Prices (SEFAZ NFC-e)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'mg', 'ba')."
        },
        "cidade": {
          "type": "string",
          "description": "Optional Brazilian city name or slug to filter local supermarket offers."
        },
        "produto": {
          "type": "string",
          "description": "Optional product search term (e.g., 'arroz', 'feijao', 'cafe', 'leite', 'cesta basica')."
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_purchasing_power_oracle",
    "description": "Calculates real purchasing power parity (PPP) and labor-hour requirements across all 27 Brazilian states (UFs). Computes the exact working hours required to afford essential household survival goods: the 13 essential grocery items (SEFAZ NFC-e / DIEESE), residential 13kg cooking gas (ANP), fuel (50L gasoline tank), and electricity (150 kWh ANEEL). Correlates with Banco Central do Brasil (BCB SGS) interest and inflation rates, thermal parity (LPG vs. electric induction cooking), and CONFAZ tax anatomy. Read-only operation; zero authentication required.",
    "annotations": {
      "title": "Brazil Purchasing Power & Labor-Hours Oracle",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state acronym (e.g. 'RJ', 'SP', 'MG', 'BA', 'DF'). Defaults to 'RJ' if omitted."
        },
        "salario_mensal_brl": {
          "type": "number",
          "description": "Monthly income in BRL to calculate labor hours against standard 220h CLT workload. Defaults to federal minimum wage (1518.00 BRL) if omitted."
        }
      },
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_energy_tariffs",
    "description": "Provides official ANEEL (Agência Nacional de Energia Elétrica) residential electricity tariffs (B1) across all 27 Brazilian states (UFs), covering state concessionaires (e.g. Light, Enel, Cemig, Copel, Equatorial, Celesc). Computes estimated monthly electric bills for a given consumption baseline (default 150 kWh), and calculates thermal cooking parity: comparing the cost of residential cooking with an ANP 13kg LPG cylinder against 99 kWh of electric induction cooking. Read-only operation; zero authentication required.",
    "annotations": {
      "title": "Brazil Residential Electricity Tariffs & Thermal Parity (ANEEL)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state acronym (e.g. 'RJ', 'SP', 'MG', 'BA', 'DF'). Defaults to 'RJ' if omitted."
        },
        "consumo_mensal_kwh": {
          "type": "number",
          "description": "Monthly electricity consumption in kWh for residential bill calculation. Defaults to standard baseline 150 kWh if omitted."
        },
        "incluir_paridade_termica_gas": {
          "type": "boolean",
          "description": "Whether to calculate thermal cooking parity comparing 13kg LPG cylinder vs 99 kWh induction cooking. Defaults to true."
        }
      },
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_cost_of_living",
    "description": "Computes a consolidated regional cost-of-living index and purchasing power parity (PPP) in Brazil, combining average fuel expenditure, basic food basket cost, and live USD/BRL exchange rate conversion. Updated daily. Read-only operation; no authentication required up to 60 req/min. Use brazil_fuel_prices or brazil_grocery_basket for granular item-level breakdowns, or brazil_compare_regions to compare two states side-by-side.",
    "annotations": {
      "title": "Brazil Regional Cost of Living & PPP Index",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'df'). Defaults to national average if omitted."
        },
        "comparar_com_dolar": {
          "type": "boolean",
          "description": "When true, converts all BRL cost metrics into USD using live exchange rates."
        }
      },
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_lpg_gas_prices",
    "description": "Queries official audited prices of residential cooking gas (13kg LPG cylinder / Botijao GLP P13) sourced from Brazil's National Petroleum Agency (ANP) across 13,145+ authorized resellers in all 27 Brazilian states. Updated weekly. Read-only operation; no authentication required up to 60 req/min. Use brazil_list_states to list valid UF codes or brazil_compare_regions to compare LPG costs between states.",
    "annotations": {
      "title": "Brazil 13kg LPG Cooking Gas Prices (ANP)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'mg', 'ba', 'pr', 'ce', 'df')."
        },
        "cidade": {
          "type": "string",
          "description": "Optional Brazilian city name to filter local LPG resellers."
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_pharma_medicines",
    "description": "Queries official Maximum Consumer Prices (PMC) and Factory Prices (PF) for 26,635+ regulated medicines in Brazil from CMED/ANVISA, including state-specific ICMS tax brackets (18% to 20%), active ingredients, laboratory, presentation, and free eligibility under the federal Farmacia Popular program. Updated monthly per CMED resolution. Read-only operation; no authentication required up to 60 req/min (returns up to 15 matching presentations per call).",
    "annotations": {
      "title": "Brazil Regulated Medicine Prices (CMED/ANVISA)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "termo": {
          "type": "string",
          "description": "Commercial brand name or active ingredient in Portuguese (e.g., 'dipirona', 'losartana', 'ozempic', 'amoxicilina', 'paracetamol')."
        },
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'mg') to apply accurate regional ICMS tax rate (default: 'sp')."
        },
        "tipo": {
          "type": "string",
          "enum": [
            "todos",
            "generico",
            "novo",
            "similar",
            "biologico"
          ],
          "description": "Regulatory category filter (default: 'todos')."
        }
      },
      "required": [
        "termo"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_list_states",
    "description": "Discovery and metadata support tool: Returns the complete list of all 27 Brazilian Federative Units (UFs) covered by the server, including state code, full name, monitored gas station count, regional ICMS tax bracket, and dataset audit timestamp. Read-only and idempotent; requires no parameters and no authentication. Call this tool first to validate UF codes before invoking brazil_fuel_prices, brazil_grocery_basket, brazil_lpg_gas_prices, or brazil_compare_regions.",
    "annotations": {
      "title": "List All 27 Brazilian States & Coverage Metadata",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_compare_regions",
    "description": "Comparative synthesis tool: Compares weighted average prices and percentage deltas for fuels (gasoline, ethanol, diesel), 13kg LPG cooking gas, and basic food basket costs side-by-side between any two Brazilian states (origin UF vs. destination UF). Read-only operation; no authentication required up to 60 req/min. Use brazil_list_states to discover valid UF codes, or brazil_fuel_prices and brazil_grocery_basket for single-state station/store drilldowns.",
    "annotations": {
      "title": "Compare Prices Between Two Brazilian States",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "origem_uf": {
          "type": "string",
          "description": "Origin two-letter Brazilian state code for comparison (e.g., 'sp', 'rj', 'ba')."
        },
        "destino_uf": {
          "type": "string",
          "description": "Destination two-letter Brazilian state code for comparison (e.g., 'mg', 'pr', 'sc')."
        },
        "indicador": {
          "type": "string",
          "enum": [
            "combustiveis",
            "gas",
            "todos"
          ],
          "description": "Economic indicator category to compare (default: 'todos')."
        }
      },
      "required": [
        "origem_uf",
        "destino_uf"
      ],
      "additionalProperties": false
    }
  }
];

function sendJson(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const rpc = JSON.parse(line);
    const id = rpc.id !== undefined ? rpc.id : 1;
    if (rpc.method === "initialize") {
      sendJson({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "mestrepratico-brazil-prices-mcp", version: "1.3.0" }
        }
      });
    } else if (rpc.method === "notifications/initialized" || (rpc.method && rpc.method.startsWith("notifications/"))) {
      // No response required for notifications
    } else if (rpc.method === "tools/list") {
      sendJson({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
    } else if (rpc.method === "ping") {
      sendJson({ jsonrpc: "2.0", id, result: {} });
    } else if (rpc.method === "tools/call") {
      const data = JSON.stringify(rpc);
      const req = https.request("https://mestrepratico.com.br/mcp/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "MestrePratico-MCP-Stdio/1.3.0"
        }
      }, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          try {
            sendJson(JSON.parse(body));
          } catch (e) {
            sendJson({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: body }] } });
          }
        });
      });
      req.on("error", (err) => {
        sendJson({ jsonrpc: "2.0", id, error: { code: -32000, message: err.message } });
      });
      req.write(data);
      req.end();
    } else {
      sendJson({ jsonrpc: "2.0", id, result: {} });
    }
  } catch (e) {}
});
