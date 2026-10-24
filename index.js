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
    "description": "Queries real-time audited retail fuel prices across all 27 Brazilian Federative Units (UFs) and 417+ cities from Brazil's National Petroleum Agency (ANP). Covers Regular Gasoline (Gasolina Comum), Additive Gasoline (Gasolina Aditivada), Hydrous Ethanol (Etanol Hidratado), Diesel S10, Diesel S500, and CNG (GNV). Calculates the official 70% ethanol-to-gasoline economic parity ratio and provides price dispersion across 21,000+ monitored gas stations. Best used when the user asks: 'Qual o preco medio da gasolina em SP?', 'Compensa abastecer com etanol ou gasolina no RJ?', or 'Quanto custa o diesel S10 em Minas Gerais?'. Returns a JSON object with state metrics, lowest/highest prices, station rankings, and parity recommendation. Read-only and idempotent operation with zero state modification.",
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
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pr', 'ce', 'df').",
          "default": "sp"
        },
        "cidade": {
          "type": "string",
          "description": "Optional city name or URL slug (e.g., 'sao-paulo', 'rio-de-janeiro', 'campinas', 'salvador'). Defaults to empty string to return state-wide average.",
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
    "description": "Queries and compares audited prices for Brazil's 13 Essential Food Basket items (rice, beans, coffee, soy oil, milk, beef, wheat flour, bread, sugar, butter, tomato, potato, banana) per Federal Decree No. 11,936/2024 and DIEESE standards. Ingests retail telemetry from SEFAZ electronic invoices (NFC-e) across Brazilian supermarket chains. Best used when the user asks: 'Quanto esta a cesta basica em SP hoje?', 'Qual o preco do quilo do feijao carioca e do arroz tipo 1 no RJ?', or 'Onde comprar alimentos mais baratos em Curitiba?'. Returns a structured JSON payload with individual product prices, minimum/maximum values, supermarket distribution, and month-over-month inflation index. Read-only and idempotent operation with zero state modification.",
    "annotations": {
      "title": "Brazil Basic Food Basket & Retail Grocery Prices (SEFAZ / DIEESE)",
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
          "description": "Two-letter Brazilian state code in lowercase (e.g., 'sp', 'rj', 'mg', 'ba', 'pr').",
          "default": "sp"
        },
        "cidade": {
          "type": "string",
          "description": "Optional Brazilian city name or slug to filter local supermarket offers (e.g., 'sao-paulo', 'rio-de-janeiro', 'belo-horizonte'). Defaults to empty string.",
          "default": ""
        },
        "produto": {
          "type": "string",
          "description": "Optional product search term or category (e.g., 'arroz', 'feijao', 'cafe', 'leite', 'oleo_soja', 'carne_bovina', 'cesta_basica'). Defaults to 'cesta_basica'.",
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
    "description": "Calculates real purchasing power parity (PPP) and labor-hour requirements across all 27 Brazilian states (UFs). Computes the exact working hours an employee earning a given monthly wage (or the statutory national minimum wage) must work to purchase a 13-item basic food basket, a 50-liter tank of gasoline or ethanol, and a 13kg cooking gas cylinder. Best used when the user asks: 'Quantas horas de trabalho custa a cesta basica no Brasil?', 'Qual porcentagem do salario minimo vai para combustivel no Rio?', or 'Calcule o poder de compra de um salario de R$ 3.000 em SP'. Returns an audited JSON object with required labor hours, income commitment percentages, and state purchasing power rankings. Read-only and idempotent operation with zero state modification.",
    "annotations": {
      "title": "Brazil Purchasing Power Parity & Labor-Hour Cost Oracle",
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
          "description": "Two-letter Brazilian state acronym (e.g. 'RJ', 'SP', 'MG', 'BA', 'DF'). Defaults to 'SP' if omitted.",
          "default": "SP"
        },
        "salario_mensal_brl": {
          "type": "number",
          "description": "Monthly income in BRL to calculate labor hours against standard 220h CLT workload. Defaults to statutory minimum wage (1412.00).",
          "default": 1412.0
        }
      },
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_energy_tariffs",
    "description": "Provides official ANEEL (Agencia Nacional de Energia Eletrica) residential electricity tariffs (B1 Conventional) across all 27 Brazilian states. Details regulated distributor baseline rates (TE + TUSD), active tariff flags (Verde, Amarela, Vermelha 1, Vermelha 2, Escassez Hidrica), and calculates thermal cooking parity comparing a 13kg LPG gas cylinder vs 99 kWh induction/electric stove energy equivalent. Best used when the user asks: 'Qual a tarifa de energia eletrica da Enel em SP?', 'Bandeira tarifaria da conta de luz este mes', or 'O que compensa mais para cozinhar: gas de botijao ou fogao de inducao?'. Returns a JSON object with base tariff in R$/kWh, additional flag surcharge, estimated monthly bill, and LPG thermal parity comparison. Read-only and idempotent operation.",
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
          "description": "Two-letter Brazilian state acronym (e.g. 'RJ', 'SP', 'MG', 'BA', 'DF'). Defaults to 'SP' if omitted.",
          "default": "SP"
        },
        "consumo_mensal_kwh": {
          "type": "number",
          "description": "Monthly electricity consumption in kWh for residential bill calculation. Defaults to typical Brazilian household average (200 kWh).",
          "default": 200
        },
        "incluir_paridade_termica_gas": {
          "type": "boolean",
          "description": "Whether to calculate thermal cooking parity comparing 13kg LPG cylinder vs 99 kWh induction/electric equivalent. Defaults to false.",
          "default": false
        }
      },
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_freight_logistics",
    "description": "Calculates official Brazilian minimum road freight rates regulated by ANTT (Agencia Nacional de Transportes Terrestres - Resolucao No. 5.867/2020) combined with live ANP Diesel S10 state benchmarks and toll plaza estimates. Computes total route cost, cost per kilometer, fuel volume consumption, and mandated freight floors across truck axle configurations. Best used when the user asks: 'Calcule o frete de Santos para Goiania para carreta 5 eixos', 'Custo estimado de diesel para rota de 800 km', or 'Qual a tabela minima da ANTT para granel solido?'. Returns a JSON object with mandated ANTT freight floor in BRL, estimated diesel expenditure, toll estimates, and net carrier operational margin. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil Minimum Freight Rate & Highway Logistics Calculator (ANTT)",
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
          "description": "Highway route distance in kilometers (e.g. 450 km for SP-RJ axis, 1200 km for MT-PR grain corridor). Defaults to 450.",
          "default": 450
        },
        "tipo_veiculo": {
          "type": "string",
          "enum": [
            "carreta_5_eixos",
            "truck_3_eixos",
            "toco_2_eixos",
            "bitrem_7_eixos",
            "rodotrem_9_eixos"
          ],
          "description": "Truck axle configuration: 'carreta_5_eixos' (standard 27t semi-trailer), 'truck_3_eixos' (14t rigid truck), 'toco_2_eixos' (6t urban delivery), 'bitrem_7_eixos' (38t grain hauler), 'rodotrem_9_eixos' (50t heavy freight). Defaults to 'carreta_5_eixos'.",
          "default": "carreta_5_eixos"
        },
        "tipo_carga": {
          "type": "string",
          "enum": [
            "granel_solido",
            "carga_geral",
            "frigorificada",
            "granel_liquido",
            "perigosa"
          ],
          "description": "Cargo classification per ANTT: 'granel_solido' (grains/staples), 'carga_geral' (palletized retail/manufactured goods), 'frigorificada' (perishables/frozen), 'granel_liquido' (fuel/oil), 'perigosa' (hazardous chemicals). Defaults to 'granel_solido'.",
          "default": "granel_solido"
        },
        "uf_origem": {
          "type": "string",
          "description": "Two-letter state acronym of cargo origin (e.g. 'MT', 'PR', 'SP', 'GO'). Defaults to 'SP'.",
          "default": "SP"
        },
        "uf_destino": {
          "type": "string",
          "description": "Two-letter state acronym of cargo destination (e.g. 'RJ', 'SP', 'BA', 'SC'). Defaults to 'RJ'.",
          "default": "RJ"
        }
      },
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_tax_anatomy",
    "description": "Performs constitutional and fiscal tax decomposition across all 27 Brazilian states (UFs) based on CONFAZ (Conselho Nacional de Politica Fazendaria) Agreements (ICMS Monofasico No. 15/2023 & No. 199/2022), Federal Decree No. 11,936/2024, and Tax Reform Constitutional Amendment EC 132/2023. Decomposes exact state ICMS ad rem rates (R$/liter), federal PIS/COFINS, and net refinery/product values for retail fuels, 13kg cooking gas, the basic food basket, and CMED pharmaceuticals. Best used when the user asks: 'Quanto de imposto pago em um litro de gasolina no RJ?', 'Qual a aliquota de ICMS monofasico sobre o diesel?', or 'Decomposicao fiscal da cesta basica em SP'. Returns a structured JSON payload with gross consumer price, state ICMS share, federal tax portion, net commodity value, and effective tax burden percentage. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil CONFAZ Tax Anatomy & Fiscal Decomposition",
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
          "description": "Two-letter Brazilian state acronym (e.g. 'RJ', 'SP', 'MG', 'BA', 'DF', 'PR', 'RS'). Defaults to 'RJ' if omitted.",
          "default": "RJ"
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
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_cost_of_living",
    "description": "Computes a consolidated regional cost-of-living index and purchasing power parity (PPP) across Brazilian states and metropolitan areas, synthesizing average monthly fuel expenditure (100L vehicle profile), basic food basket costs (DIEESE/SEFAZ), residential electricity bills (ANEEL), and live USD/BRL currency conversion. Best used when the user asks: 'Qual o custo de vida em Sao Paulo comparado ao Rio de Janeiro?', 'Quanto custa manter uma familia no Sul vs Nordeste do Brasil?', or 'Cost of living index in Brazil in USD'. Returns a JSON object with consolidated monthly living cost in BRL and USD, state comparative index normalized against national baseline, and sector cost weights. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil Regional Cost of Living & Purchasing Power Parity (PPP)",
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
          "description": "Two-letter Brazilian state code (e.g., 'SP', 'RJ', 'MG', 'DF', 'BA'). Defaults to national average ('BR') if omitted.",
          "default": "BR"
        },
        "comparar_com_dolar": {
          "type": "boolean",
          "description": "When true, converts all BRL cost metrics into USD using live official exchange rates (AwesomeAPI/Banco Central). Defaults to false.",
          "default": false
        }
      },
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_lpg_gas_prices",
    "description": "Queries official audited prices of residential cooking gas (13kg LPG cylinder / Botijao GLP P13) sourced from Brazil's National Petroleum Agency (ANP) across 13,145+ authorized distribution points in all 27 Brazilian states. Tracks weekly average, minimum, and maximum prices, state ICMS impact, and reseller profit margins. Best used when the user asks: 'Quanto custa o botijao de gas em Sao Paulo?', 'Onde encontrar gas de cozinha mais barato em BH?', or 'Qual a variacao do preco do GLP 13kg no Rio Grande do Sul?'. Returns a JSON object with state and municipal price distributions, lowest observed price, highest observed price, and historical trend. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil 13kg LPG Cooking Gas Prices (ANP Botijao P13)",
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
          "description": "Optional Brazilian city name or URL slug to filter local LPG resellers (e.g., 'sao-paulo', 'rio-de-janeiro', 'curitiba'). Defaults to empty string to return state average.",
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
    "description": "Queries official Maximum Consumer Prices (Preco Maximo ao Consumidor - PMC) and Factory Prices (Preco Fabricante - PF) for 26,635+ regulated pharmaceuticals from the CMED/ANVISA registry. Automatically computes state-specific ICMS tax brackets (17%, 18%, 19%, 20%, 20.5%, 21% or 22%) and compares brand-name reference medicines against bioequivalent Generics (Genericos) and Similar products. Best used when the user asks: 'Qual o preco maximo regulado da Dipirona 500mg pela ANVISA?', 'Comparar preco de referencia vs generico do Losartana', or 'Tabela CMED para antibioticos no estado de SP'. Returns a JSON object with commercial brand, active molecule, laboratory, therapeutic class, PMC ceiling by state ICMS, and generic savings index. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil Regulated Medicine Price Caps & CMED / ANVISA Oracle",
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
          "description": "Commercial brand name or active pharmaceutical ingredient in Portuguese (e.g., 'dipirona', 'losartana', 'amoxicilina', 'paracetamol', 'omeprazol'). Defaults to 'dipirona'.",
          "default": "dipirona"
        },
        "uf": {
          "type": "string",
          "description": "Two-letter Brazilian state code (e.g., 'sp', 'rj', 'mg', 'ba', 'pr') to apply accurate regional ICMS tax bracket (18% vs 20%). Defaults to 'sp'.",
          "default": "sp"
        },
        "tipo": {
          "type": "string",
          "enum": [
            "todos",
            "generico",
            "referencia",
            "similar"
          ],
          "description": "Regulatory category filter: 'todos' (all), 'generico' (generic bioequivalent), 'referencia' (originator brand), 'similar'. Defaults to 'todos'.",
          "default": "todos"
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
    "description": "Discovery and metadata reference tool: Returns the complete, canonical list of all 27 Brazilian Federative Units (UFs) covered by the Mestre Pratico oracle. Provides two-letter state codes, official state names, macro-regions (Norte, Nordeste, Centro-Oeste, Sudeste, Sul), monitored retail point counts, and regional ICMS tax brackets. Best used when the user asks: 'Quais estados brasileiros sao monitorados?', 'Liste todas as UFs disponiveis', or to validate state acronyms before calling fuel, grocery, or freight tools. Returns a structured JSON array of 27 state objects with codes, names, geographic regions, and database synchronization timestamps. Read-only, deterministic, and idempotent.",
    "annotations": {
      "title": "List All 27 Brazilian States, UF Metadata & Coverage Index",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "regiao": {
          "type": "string",
          "enum": [
            "todas",
            "sudeste",
            "sul",
            "nordeste",
            "centro-oeste",
            "norte"
          ],
          "description": "Optional macro-region filter: 'todas', 'sudeste', 'sul', 'nordeste', 'centro-oeste', 'norte'. Defaults to 'todas' to return all 27 states.",
          "default": "todas"
        }
      },
      "required": [],
      "additionalProperties": false
    }
  },
  {
    "name": "brazil_compare_regions",
    "description": "Comparative synthesis tool: Calculates side-by-side price differentials, percentage deltas, and economic variances between any two Brazilian states across retail fuels (gasoline, ethanol, diesel), basic food basket commodities, residential LPG cooking gas, and electricity tariffs. Best used when the user asks: 'Qual estado e mais barato: SP ou RJ?', 'Compare o preco do diesel entre Mato Grosso e Parana', or 'Diferenca percentual da cesta basica entre Nordeste e Sudeste'. Returns a structured JSON payload comparing Origin state vs Destination state with absolute BRL differences, percentage spreads, and cheaper-state indicators. Read-only and idempotent operation.",
    "annotations": {
      "title": "Brazil Inter-State Economic Comparison & Price Delta Synthesizer",
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
          "description": "Origin two-letter Brazilian state code for baseline comparison (e.g., 'SP', 'RJ', 'BA', 'MG', 'PR').",
          "default": "SP"
        },
        "destino_uf": {
          "type": "string",
          "description": "Destination two-letter Brazilian state code for target comparison (e.g., 'MG', 'PR', 'SC', 'GO', 'RS').",
          "default": "RJ"
        },
        "indicador": {
          "type": "string",
          "enum": [
            "todos",
            "combustiveis",
            "gas",
            "cesta_basica",
            "energia"
          ],
          "description": "Economic indicator category to compare: 'todos', 'combustiveis', 'gas', 'cesta_basica', 'energia'. Defaults to 'todos'.",
          "default": "todos"
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
