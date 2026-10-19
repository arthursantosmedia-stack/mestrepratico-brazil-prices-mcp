#!/usr/bin/env node
/**
 * Mestre Prático & NutriPreço — Model Context Protocol (MCP) Bridge
 * Holding Arthur Luis Vieira dos Santos
 * 
 * Provides STDIO bridge for Claude Desktop, Cursor, and Windsurf,
 * connecting to the Sovereign Cloudflare Edge MCP endpoint.
 */

const readline = require('readline');

const MCP_ENDPOINT = process.env.MESTRE_PRATICO_MCP_URL || 'https://mestrepratico.com.br/mcp/v1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const payload = JSON.parse(trimmed);

    const res = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MestrePratico-MCP-Bridge/1.0.0'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: payload.id || null,
        error: {
          code: -32603,
          message: `Remote MCP Edge Error (${res.status}): ${errText}`
        }
      }) + '\n');
      return;
    }

    const data = await res.json();
    process.stdout.write(JSON.stringify(data) + '\n');
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: `Parse Error / Bridge Exception: ${err.message}`
      }
    }) + '\n');
  }
});
