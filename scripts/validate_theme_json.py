#!/usr/bin/env python3
"""Dependency-free Shopify theme JSON integrity checks.

This runs offline: it catches malformed JSON and section/template references,
not browser, Liquid rendering, checkout, or Theme Check issues.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []
checked = 0

def read_json(path: Path):
    global checked
    source = path.read_text(encoding="utf-8-sig")
    source = re.sub(r"^\s*/\*[\s\S]*?\*/", "", source, count=1)
    try:
        result = json.loads(source)
    except json.JSONDecodeError as exc:
        errors.append(f"{path.relative_to(ROOT)}: invalid JSON at line {exc.lineno}: {exc.msg}")
        return None
    checked += 1
    return result

for path in sorted((ROOT / "templates").rglob("*.json")):
    doc = read_json(path)
    if not isinstance(doc, dict):
        continue
    sections = doc.get("sections")
    order = doc.get("order")
    if not isinstance(sections, dict) or not isinstance(order, list):
        errors.append(f"{path.relative_to(ROOT)}: missing sections map or order list")
        continue
    for section_id in order:
        if section_id not in sections:
            errors.append(f"{path.relative_to(ROOT)}: ordered section {section_id!r} missing")
    for section_id, section in sections.items():
        if not isinstance(section, dict):
            errors.append(f"{path.relative_to(ROOT)}: invalid section {section_id!r}")
            continue
        section_type = section.get("type")
        if isinstance(section_type, str) and section_type and not section_type.startswith("shopify://"):
            if not (ROOT / "sections" / f"{section_type}.liquid").is_file():
                errors.append(f"{path.relative_to(ROOT)}: missing sections/{section_type}.liquid")
        blocks = section.get("blocks", {})
        block_order = section.get("block_order", [])
        if isinstance(blocks, dict) and isinstance(block_order, list):
            for block_id in block_order:
                if block_id not in blocks:
                    errors.append(f"{path.relative_to(ROOT)}: block {block_id!r} missing in {section_id!r}")

for path in sorted((ROOT / "sections").glob("*.json")):
    read_json(path)
for path in sorted((ROOT / "config").glob("*.json")):
    read_json(path)
for path in sorted((ROOT / "listings").glob("*/templates/*.json")):
    read_json(path)

print(f"Validated JSON in {checked} theme files.")
if errors:
    for error in errors:
        print("ERROR:", error, file=sys.stderr)
    sys.exit(1)
print("PASS: no malformed JSON or dangling template section/block references")
