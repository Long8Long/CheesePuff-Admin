#!/usr/bin/env bash
# pack.sh — Package source code, configs, and Dockerfile into a tar.gz for Docker image deployment.

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="${PROJECT_ROOT}/dist-pkg"
OUTPUT_FILE="${OUTPUT_DIR}/${PROJECT_NAME}_${TIMESTAMP}.tar.gz"

# Files and directories to include
INCLUDE=(
  src
  public
  index.html
  Dockerfile
  package.json
  pnpm-lock.yaml
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  components.json
  eslint.config.js
)

# ── Main ─────────────────────────────────────────────────────────────────────
echo "Packaging ${PROJECT_NAME} ..."
echo "Output: ${OUTPUT_FILE}"
echo ""

mkdir -p "$OUTPUT_DIR"

cd "$PROJECT_ROOT"

# Build the tar.gz with only the listed files/dirs
tar -czf "$OUTPUT_FILE" "${INCLUDE[@]}"

SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
echo "Done. Package size: ${SIZE}"
echo "File: ${OUTPUT_FILE}"
