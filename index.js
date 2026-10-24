#!/usr/bin/env node
/**
 * Mestre Prático & NutriPreço – Official Sovereign MCP Server (STDIO + Edge Proxy)
 * Holding Arthur Luis Vieira dos Santos
 * Connects local MCP clients, AI agents and Glama inspection sandboxes to https://mestrepratico.com.br/mcp/v1
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
    "description": "Queries real-time audited retail fuel prices across all 27 Brazilian Federative Units (UFs) and 417+ cities from Brazil's National Petroleum Agency (ANP). Covers Regular Gasoline (Gasolina Comum), Additive Gasoline (Gasolina Aditivada), Hydrous Ethanol (Etanol Hidratado), Diesel S10, Diesel S500, and CNG (GNV). Calculates official 70% biofuel economic parity ratio and price dispersion across 21,000+ monitored gas stations. When to use: Retrieve current station-level and statewide retail fuel prices and ethanol vs gasoline parity in Brazil. When NOT to use: Do NOT use for residential cooking gas LPG prices (use brazil_lpg_gas_prices) or freight transport rates (use brazil_freight_logistics). Read-only and idempotent operation; no authentication required up to 60 req/min.",
    "annotations": {
      "title": "Brazil Retail Fuel Prices & Biofuel Parity (ANP)",
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
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pr', 'ce', 'df'). Call brazil_list_states to see all 27 valid UF codes.",
          "default": "sp"
        },
        "cidade": {
          "type": "string",
          "description": "Optional city name or URL slug (e.g., 'sao-paulo', 'rio-de-janeiro', 'campinas', 'salvador'). Defaults to empty string to return statewide statistics.",
          "default": ""
        },
        "combustivel": {
          "type": "string",
          "enum": [
            "todos",
            "gasolina",
            "gasolina_aditivada",
            "etanol",
            "diesel_s10",
            "diesel_s500",
            "gnv"
          ],
          "description": "Fuel type filter for price ranking and statistics. Defaults to 'todos'.",
          "default": "todos"
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
    "description": "Queries real-time audited supermarket prices of Brazil's 13 Basic Food Basket items (rice, beans, coffee, soybean oil, milk, sugar, beef, french bread, butter, flour, tomato, banana, potato) sourced from electronic consumer invoices (NFC-e SEFAZ) and DIEESE methodology across 59 regional hubs. When to use: Look up staple grocery prices, item-level supermarket quotes, and food basket totals. When NOT to use: Do NOT use for broad cost-of-living index synthesis (use brazil_cost_of_living) or minimum-wage labor hours (use brazil_purchasing_power_oracle). Read-only and idempotent operation; no authentication required up to 60 req/min.",
    "annotations": {
      "title": "Brazil Basic Food Basket Supermarket Prices (NFC-e / DIEESE)",
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
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pe', 'rs'). Defaults to 'sp'.",
          "default": "sp"
        },
        "cidade": {
          "type": "string",
          "description": "Optional Brazilian city name or slug to filter local supermarket chains. Defaults to empty string to return statewide summary.",
          "default": ""
        },
        "produto": {
          "type": "string",
          "description": "Optional food item filter (e.g., 'arroz', 'feijao', 'cafe', 'leite', 'oleo_soja', 'carne', 'pao_frances', 'cesta_basica'). Defaults to 'cesta_basica'.",
          "default": "cesta_basica"
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
    "description": "Calculates real purchasing power parity (PPP) and minimum-wage labor hours required to afford essential household survival goods across all 27 Brazilian states (UFs). Computes the exact working hours (against 220h standard CLT workload) required to afford: the 13 essential grocery items (SEFAZ NFC-e), residential 13kg LPG cooking gas (ANP), vehicle fuel (50L gasoline tank), and electricity (150 kWh ANEEL). Correlates with Banco Central do Brasil (BCB SGS) interest and inflation rates. When to use: Use specifically to calculate labor hours, affordability indexes, and economic survival metrics against minimum wage. When NOT to use: Do NOT use for raw supermarket grocery prices (use brazil_grocery_basket), fuel pump prices (use brazil_fuel_prices), or broad macro index comparisons (use brazil_compare_regions). Read-only and idempotent operation; zero authentication required.",
    "annotations": {
      "title": "Brazil Purchasing Power & Labor Hours Oracle (PPP)",
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
          "description": "Two-letter Brazilian state acronym (e.g., 'rj', 'sp', 'mg', 'ba', 'df'). Defaults to 'rj'.",
          "default": "rj"
        },
        "salario_base": {
          "type": "number",
          "description": "Monthly income in BRL to calculate labor hours against standard 220h CLT workload. Defaults to federal minimum wage (1518.00 BRL).",
          "default": 1518.0
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_energy_tariffs",
    "description": "Provides official ANEEL (Agencia Nacional de Energia Eletrica) residential electricity tariffs (B1) across all 27 Brazilian states (UFs), covering state concessionaires (e.g., Light, Enel, Cemig, Copel, Equatorial, Celesc). Computes estimated monthly electric bills for a given consumption baseline (default 150 kWh), and calculates thermal cooking parity: comparing the cost of residential cooking with an ANP 13kg LPG cylinder against 99 kWh of electric induction cooking. When to use: Look up residential electric tariffs, calculate monthly power bills, or analyze thermal cooking parity. When NOT to use: Do NOT use for vehicle fuel pump prices (use brazil_fuel_prices) or freight logistics (use brazil_freight_logistics). Read-only and idempotent operation; zero authentication required.",
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
          "description": "Two-letter Brazilian state acronym (e.g., 'rj', 'sp', 'mg', 'ba', 'df'). Defaults to 'rj'.",
          "default": "rj"
        },
        "consumo_kwh": {
          "type": "number",
          "description": "Monthly electricity consumption in kWh for residential bill calculation. Defaults to standard baseline 150 kWh.",
          "default": 150.0
        },
        "calcular_paridade_termica": {
          "type": "boolean",
          "description": "Whether to calculate thermal cooking parity comparing 13kg LPG cylinder vs 99 kWh induction cooking. Defaults to true.",
          "default": true
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_freight_logistics",
    "description": "Calculates official Brazilian minimum road freight rates regulated by ANTT (Agencia Nacional de Transportes Terrestres - Resolution No. 5,867/2020) across all vehicle classes (2 to 9 axles) and cargo types (solid bulk, general cargo, refrigerated). Correlates freight costs with ANP Diesel S10 pump prices, computing diesel fuel expense ratio and the logistical cost impact per kilogram of food transported. When to use: Calculate official ANTT freight rates, diesel expense ratio, or transport logistics costs between Brazilian cities. When NOT to use: Do NOT use for retail diesel pump prices at local gas stations (use brazil_fuel_prices). Read-only and idempotent operation; zero authentication required.",
    "annotations": {
      "title": "Brazil Road Freight Minimum Rates & Logistics Cost (ANTT)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "distancia_km": {
          "type": "number",
          "description": "Total road route distance in kilometers (e.g., 430 for SP-RJ corridor). Defaults to 100 km.",
          "default": 100.0
        },
        "tipo_carga": {
          "type": "string",
          "enum": [
            "geral",
            "granel_solido",
            "granel_liquido",
            "frigorificada",
            "perigosa"
          ],
          "description": "ANTT cargo classification type. Defaults to 'geral'.",
          "default": "geral"
        },
        "numero_eixos": {
          "type": "integer",
          "enum": [
            2,
            3,
            4,
            5,
            6,
            7,
            9
          ],
          "description": "Vehicle axle configuration (2=truck, 3=heavy truck, 5=semi-trailer, 6=trailer, 7=bitrem, 9=rodotrem). Defaults to 3.",
          "default": 3
        },
        "uf_origem": {
          "type": "string",
          "description": "Origin state code (e.g., 'sp', 'rj', 'mg') for diesel price correlation. Defaults to 'sp'.",
          "default": "sp"
        }
      },
      "required": [
        "distancia_km"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_tax_anatomy",
    "description": "Details the anatomy of indirect consumption taxes in Brazil across all 27 states (UFs), covering single-phase ICMS (ad rem fixed per unit under CONFAZ Agreements 15/2023 and 199/2022 for fuels and LPG), standard ad valorem ICMS (17% to 22%), federal PIS/COFINS, and CIDE. Demonstrates the price formation cascade and federal tax reform (EC 132/2023 - IBS/CBS) transition impacts. When to use: Analyze fiscal burden, tax breakdown, and government revenue share in Brazilian consumer prices. When NOT to use: Do NOT use for basic price lookups without tax breakdown (use domain tools like brazil_fuel_prices). Read-only and idempotent operation; zero authentication required.",
    "annotations": {
      "title": "Brazil Consumption Tax Anatomy & ICMS Monofasico (CONFAZ)",
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
          "description": "Two-letter Brazilian state acronym (e.g., 'sp', 'rj', 'mg', 'ba', 'df'). Defaults to 'sp'.",
          "default": "sp"
        },
        "categoria": {
          "type": "string",
          "enum": [
            "todos",
            "combustiveis",
            "gas_cozinha",
            "cesta_basica",
            "medicamentos"
          ],
          "description": "Category to analyze tax anatomy: 'todos', 'combustiveis', 'gas_cozinha', 'cesta_basica', 'medicamentos'. Defaults to 'todos'.",
          "default": "todos"
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_cost_of_living",
    "description": "Computes a consolidated regional cost-of-living index and purchasing power parity (PPP) in Brazil, combining average fuel expenditure, basic food basket cost, utility benchmarks, and live USD/BRL exchange rate conversion. Updated daily. When to use: Assess total monthly household survival costs and regional living cost comparisons across Brazilian states. When NOT to use: Do NOT use for minimum wage labor hour metrics (use brazil_purchasing_power_oracle) or single-item grocery quotes (use brazil_grocery_basket). Read-only operation; no authentication required up to 60 req/min.",
    "annotations": {
      "title": "Brazil Consolidated Regional Cost-of-Living Index",
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
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'df', 'mg'). Defaults to 'sp'.",
          "default": "sp"
        },
        "converter_usd": {
          "type": "boolean",
          "description": "When true, converts all BRL cost metrics into USD using live exchange rates. Defaults to false.",
          "default": false
        }
      },
      "required": [
        "uf"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_lpg_gas_prices",
    "description": "Queries official audited retail prices of residential cooking gas (13kg LPG cylinder / Botijao de Gas GLP P13) sourced from Brazil's National Petroleum Agency (ANP) across 13,145+ authorized resellers in all 27 Brazilian states. Updated weekly with distributor markups and regional dispersion. When to use: Look up residential 13kg cooking gas prices by state or city in Brazil. When NOT to use: Do NOT use for vehicle fuels such as gasoline, ethanol, or CNG (use brazil_fuel_prices) or electricity tariffs (use brazil_energy_tariffs). Read-only and idempotent operation; no authentication required up to 60 req/min.",
    "annotations": {
      "title": "Brazil Audited Residential Cooking Gas Prices (ANP 13kg LPG)",
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
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pr', 'ce', 'df'). Defaults to 'sp'.",
          "default": "sp"
        },
        "cidade": {
          "type": "string",
          "description": "Optional Brazilian city name or slug to filter local LPG resellers (e.g., 'sao-paulo', 'cabo-frio', 'recife'). Defaults to empty string to return statewide statistics.",
          "default": ""
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
    "description": "Queries official Maximum Consumer Prices (PMC) and Factory Prices (PF) for 26,635+ regulated medicines in Brazil from CMED/ANVISA, including state-specific ICMS tax brackets (18% to 20%), active ingredients, laboratory, presentation, and 100% free dispensing eligibility under the federal Farmacia Popular program (PFPB). When to use: Look up official regulated medicine ceiling prices (PMC), verify generic active ingredient equivalence, or check free dispensing status under Farmacia Popular across Brazilian states. When NOT to use: Do NOT use for supermarket personal care products (use brazil_grocery_basket) or non-pharmaceutical price queries. Read-only and idempotent operation; no authentication required up to 60 req/min (returns up to 15 matching presentations per call).",
    "annotations": {
      "title": "Brazil Regulated Pharmaceutical Prices & Farmacia Popular (CMED/ANVISA)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "busca": {
          "type": "string",
          "description": "Commercial brand name or active pharmaceutical ingredient in Portuguese (e.g., 'dipirona', 'losartana', 'metformina', 'insulina', 'amoxicilina', 'paracetamol'). Defaults to 'losartana'.",
          "default": "losartana"
        },
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'mg', 'ba') to apply accurate regional ICMS tax bracket. Defaults to 'sp'.",
          "default": "sp"
        },
        "categoria": {
          "type": "string",
          "enum": [
            "todos",
            "farmacia_popular",
            "genericos",
            "referencia",
            "similares"
          ],
          "description": "Regulatory medicine category filter: 'todos' (all regulated CMED entries), 'farmacia_popular' (100% free SUS program medicines), 'genericos' (bioequivalent generics), 'referencia' (innovator reference drugs), 'similares' (similar branded drugs). Defaults to 'todos'.",
          "default": "todos"
        }
      },
      "required": [
        "busca"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_list_states",
    "description": "Discovery and metadata support tool: Returns the complete list of all 27 Brazilian Federative Units (UFs) covered by the server, including state code, state name, geographic macro-region, monitored gas station count, regional ICMS tax bracket, and dataset audit timestamp. When to use: Call this tool first to discover and validate state codes (uf) before invoking brazil_fuel_prices, brazil_grocery_basket, brazil_lpg_gas_prices, or brazil_compare_regions. When NOT to use: Do NOT use to get actual commodity prices (use domain-specific tools like brazil_fuel_prices). Read-only and idempotent; requires no parameters and no authentication.",
    "annotations": {
      "title": "Brazil Federative Units Discovery & State Metadata (27 UFs)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_compare_regions",
    "description": "Comparative synthesis tool: Compares weighted average prices and percentage deltas for fuels (gasoline, ethanol, diesel), 13kg LPG cooking gas, and basic food basket costs side-by-side between any two Brazilian states (origin UF vs. destination UF). When to use: Compare economic indicators and price differentials between two Brazilian states. When NOT to use: Do NOT use for single-state detailed station or store listings (use brazil_fuel_prices or brazil_grocery_basket). Read-only operation; no authentication required up to 60 req/min.",
    "annotations": {
      "title": "Brazil Inter-State Economic & Price Comparison Tool",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "uf_origem": {
          "type": "string",
          "description": "Origin two-letter Brazilian state code for comparison (e.g., 'sp', 'rj', 'ba'). Defaults to 'sp'.",
          "default": "sp"
        },
        "uf_destino": {
          "type": "string",
          "description": "Destination two-letter Brazilian state code for comparison (e.g., 'mg', 'pr', 'sc', 'rj'). Defaults to 'rj'.",
          "default": "rj"
        },
        "categoria": {
          "type": "string",
          "enum": [
            "todos",
            "combustiveis",
            "gas_cozinha",
            "cesta_basica"
          ],
          "description": "Economic indicator category to compare: 'todos', 'combustiveis', 'gas_cozinha', 'cesta_basica'. Defaults to 'todos'.",
          "default": "todos"
        }
      },
      "required": [
        "uf_origem",
        "uf_destino"
      ],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_contract_intent_a2a",
    "description": "Issues a cryptographically signed Machine-to-Machine (A2A) Economic Intent Protocol and settlement guarantee. Enables enterprise autonomous agents (fleet management bots, hospital procurement systems, wholesale supply coordinators) to formalize an intention to acquire fuels, basic food baskets, or regulated pharmaceutical supplies. The oracle verifies factual minimum prices against primary audited databases and generates a tamper-proof SHA-256 digital certificate issued by Holding Arthur Luis Vieira dos Santos, valid for 24 hours as an immutable settlement ceiling. When to use: Use when two autonomous agents need to negotiate and seal a formal procurement protocol with verifiable digital signature and settlement bounds. When NOT to use: Do NOT use for simple read-only price checks (use brazil_fuel_prices, brazil_grocery_basket, or brazil_pharma_medicines). Idempotent cryptographic certificate generation.",
    "annotations": {
      "title": "Brazil A2A Intent Protocol & Machine Contract Oracle",
      "readOnlyHint": false,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "tipo_operacao": {
          "type": "string",
          "enum": [
            "abastecimento_frota",
            "cesta_basica_atacado",
            "dispensacao_farmaceutica",
            "auditoria_tributaria"
          ],
          "description": "Economic procurement category for the machine intent contract: 'abastecimento_frota' (fleet refueling), 'cesta_basica_atacado' (wholesale food baskets), 'dispensacao_farmaceutica' (pharmaceutical supply), 'auditoria_tributaria' (tax audit certification). Defaults to 'abastecimento_frota'.",
          "default": "abastecimento_frota"
        },
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code where procurement will take place (e.g., 'rj', 'sp', 'mg', 'ba', 'pe'). Defaults to 'rj'.",
          "default": "rj"
        },
        "cidade": {
          "type": "string",
          "description": "Target Brazilian municipality or distribution hub (e.g., 'Cabo Frio', 'Sao Paulo', 'Recife', 'Rio de Janeiro'). Defaults to 'Cabo Frio'.",
          "default": "Cabo Frio"
        },
        "agente_solicitante_id": {
          "type": "string",
          "description": "Unique identifier or public key of the requesting partner AI agent or automated fleet bot. Defaults to 'FleetBot-Logistica-01'.",
          "default": "FleetBot-Logistica-01"
        },
        "volume_estimado": {
          "type": "number",
          "description": "Estimated procurement volume in liters (for fuels), units (for food baskets), or packages (for medicines). Defaults to 500.",
          "default": 500.0
        },
        "item_especifico": {
          "type": "string",
          "description": "Specific commodity code, fuel type (e.g., 'diesel_s10', 'gasolina'), or active pharmaceutical ingredient (e.g., 'losartana'). Defaults to 'diesel_s10'.",
          "default": "diesel_s10"
        }
      },
      "required": [
        "tipo_operacao",
        "uf"
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
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { subscribe: false, listChanged: false }
          },
          serverInfo: { name: "mestrepratico-brazil-prices-mcp", version: "1.6.0" }
        }
      });
    } else if (rpc.method === "notifications/initialized" || (rpc.method && rpc.method.startsWith("notifications/"))) {
      // No response required for notifications
    } else if (rpc.method === "tools/list") {
      sendJson({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
    } else if (rpc.method === "ping") {
      sendJson({ jsonrpc: "2.0", id, result: {} });
    } else if (rpc.method === "tools/call" || (rpc.method && (rpc.method.startsWith("prompts/") || rpc.method.startsWith("resources/") || rpc.method.startsWith("tasks/") || rpc.method.startsWith("message/")))) {
      const data = JSON.stringify(rpc);
      const req = https.request("https://mestrepratico.com.br/mcp/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "MestrePratico-MCP-Stdio/1.6.0"
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
