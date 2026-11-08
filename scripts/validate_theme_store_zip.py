#!/usr/bin/env python3
"""Validate a Shopify CLI theme package for Partner Dashboard upload.

This checks the archive structure and preset parity at a structural level.
It does not certify Shopify Theme Store approval, functional correctness,
image licenses, or real browser/Lighthouse results.
"""
from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
VALID_TOP = {
    "assets", "blocks", "config", "layout", "listings", "locales",
    "sections", "snippets", "templates"
}
ESSENTIAL = {
    "config/settings_schema.json",
    "config/settings_data.json",
    "layout/theme.liquid",
    "templates/index.json",
    "templates/product.json",
    "templates/collection.json",
    "templates/gift_card.liquid",
    "templates/cart.json",
    "templates/search.json",
}
errors: list[str] = []

packages = sorted(ROOT.glob("*.zip"))
if len(packages) != 1:
    sys.exit(f"Expected one Shopify CLI theme ZIP, found {len(packages)}.")
package = packages[0]
with zipfile.ZipFile(package) as archive:
    if archive.testzip() is not None:
        errors.append("Archive has a bad CRC or damaged member.")
    filenames = [name for name in archive.namelist() if not name.endswith("/")]
    names = set(filenames)
    for name in filenames:
        item = PurePosixPath(name)
        if item.is_absolute() or ".." in item.parts or len(item.parts) < 2:
            errors.append(f"Unsafe or unexpected ZIP path: {name}")
        elif item.parts[0] not in VALID_TOP:
            errors.append(f"Unexpected root folder in ZIP: {name}")
    for required in sorted(ESSENTIAL):
        if required not in names:
            errors.append(f"Required theme file missing from ZIP: {required}")
    for prefix in (".github/", "docs/", "scripts/", "preview/", ".git/"):
        if any(name.startswith(prefix) for name in filenames):
            errors.append(f"Development files included: {prefix}")

    def read_json(member: str):
        if member not in names:
            errors.append(f"Missing JSON member: {member}")
            return None
        try:
            content = archive.read(member).decode("utf-8-sig")
            content = re.sub(r"^\s*/\*[\s\S]*?\*/", "", content, count=1)
            return json.loads(content)
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            errors.append(f"{member}: cannot read JSON: {exc}")
            return None

    schema = read_json("config/settings_schema.json")
    data = read_json("config/settings_data.json")
    if isinstance(schema, list):
        info = next((block for block in schema if block.get("name") == "theme_info"), None)
        if not info:
            errors.append("Theme Store ZIP has no theme_info schema block.")
        else:
            for field in ("theme_name", "theme_version", "theme_author", "theme_documentation_url", "theme_support_email"):
                if not info.get(field):
                    errors.append(f"Theme info missing {field}.")
            version = info.get("theme_version", "")
            if not re.fullmatch(r"\d+\.\d+\.\d+", version):
                errors.append(f"Unexpected version format: {version!r}.")
    else:
        errors.append("config/settings_schema.json must contain an array.")

    presets = data.get("presets", {}) if isinstance(data, dict) else {}
    if not isinstance(presets, dict) or set(presets) != {"Waypoint", "Daylight"}:
        errors.append(f"Expected Waypoint and Daylight presets; found {list(presets)}.")
    for preset in ("waypoint", "daylight"):
        member = f"listings/{preset}/templates/index.json"
        listing = read_json(member)
        if isinstance(listing, dict):
            section_ids = listing.get("sections", {})
            order = listing.get("order", [])
            if not isinstance(section_ids, dict) or not isinstance(order, list):
                errors.append(f"{member}: invalid sections/order format")
            elif not order:
                errors.append(f"{member}: empty section order")
            elif any(section_id not in section_ids for section_id in order):
                errors.append(f"{member}: invalid section order references")

    gift_card = archive.read("templates/gift_card.liquid").decode("utf-8") if "templates/gift_card.liquid" in names else ""
    if "qrcode.js" not in gift_card or "QRCode" not in gift_card:
        errors.append("Gift card template lacks the required QR code rendering.")
    if "gift_card.pass_url" not in gift_card:
        errors.append("Gift card template lacks Apple Wallet pass handling.")

print(f"Package: {package.name} ({package.stat().st_size:,} bytes, {len(filenames)} files)")
if errors:
    for error in errors:
        print("ERROR:", error, file=sys.stderr)
    sys.exit(1)
print("PASS: ZIP integrity, Shopify theme structure, both preset listings, gift-card basics.")
print("NOTE: Functional review, originality, licensing, demo stores, accessibility and performance remain unverified.")
