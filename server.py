#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mestre Prático & NutriPreço — Model Context Protocol (MCP) Python Bridge
Holding Arthur Luis Vieira dos Santos

Zero-dependency STDIO bridge forwarding to Sovereign Cloudflare Edge MCP endpoint.
Compatible with Python 3.8+ on Windows, macOS, and Linux.
"""

import sys
import os
import json
import urllib.request
import urllib.error

MCP_ENDPOINT = os.getenv("MESTRE_PRATICO_MCP_URL", "https://mestrepratico.com.br/mcp/v1")

def main():
    if sys.platform == "win32":
        try:
            sys.stdin.reconfigure(encoding="utf-8")
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            req_data = line.encode("utf-8")
            req = urllib.request.Request(
                MCP_ENDPOINT,
                data=req_data,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "MestrePratico-MCP-PythonBridge/1.0.0"
                },
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=30) as resp:
                body = resp.read().decode("utf-8")
                sys.stdout.write(body + "\n")
                sys.stdout.flush()

        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            resp_err = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": -32603,
                    "message": f"Remote MCP Error ({e.code}): {err_body}"
                }
            }
            sys.stdout.write(json.dumps(resp_err) + "\n")
            sys.stdout.flush()

        except Exception as e:
            resp_err = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": -32700,
                    "message": f"Bridge Exception: {str(e)}"
                }
            }
            sys.stdout.write(json.dumps(resp_err) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
