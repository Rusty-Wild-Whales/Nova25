#!/usr/bin/env python3
"""
Scrape recent U.S. legislation directly from GovInfo's public bulk-data service.

This avoids the GovTrack API (which now rate-limits anonymous clients) by downloading
bill status XML files, extracting summaries + latest actions, and merging the results
into server/src/bills.json for the CivicLens demo.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable, List, Optional
import textwrap
import sys
import time
from xml.etree import ElementTree as ET

import requests

if sys.version_info < (3, 9):
  raise SystemExit("CivicLens scraping tools require Python 3.9+. Please run with `python3`.")

ROOT_DIR = Path(__file__).resolve().parents[1]
BILLS_PATH = ROOT_DIR / "server" / "src" / "bills.json"
BASE_STATUS_URL = "https://www.govinfo.gov/bulkdata/BILLSTATUS"
MAX_TEXT_LENGTH = 20000
SESSION = requests.Session()

PASSED_KEYWORDS = (
  "Became Public Law",
  "Signed by President",
  "Presented to President",
  "Became law",
  "Became Public",
)


def build_status_url(congress: str, bill_type: str, number: int) -> str:
  return f"{BASE_STATUS_URL}/{congress}/{bill_type.lower()}/BILLSTATUS-{congress}{bill_type.lower()}{number}.xml"


def fetch_bill(congress: str, bill_type: str, number: int, timeout: int = 10) -> Optional[ET.Element]:
  url = build_status_url(congress, bill_type, number)
  response = SESSION.get(url, timeout=timeout)
  if response.status_code == 404:
    return None
  response.raise_for_status()
  try:
    root = ET.fromstring(response.text)
    return root.find("bill")
  except ET.ParseError:
    return None


def extract_summary(bill: ET.Element) -> str:
  summaries = bill.find("summaries")
  if summaries is not None:
    first_item = summaries.find("item")
    if first_item is not None:
      text = first_item.findtext("text")
      if text:
        return textwrap.shorten(" ".join(text.split()), width=500, placeholder="…")
  # fallback to latest action text if no summary exists
  latest = bill.find("latestAction")
  latest_text = latest.findtext("text") if latest is not None else ""
  return latest_text or "Summary pending."


def extract_policy_area(bill: ET.Element) -> str:
  policy_area = bill.find("policyArea")
  if policy_area is not None:
    name = policy_area.findtext("name")
    if name:
      return name
  subjects = bill.find("subjects")
  if subjects is not None:
    item = subjects.find("item")
    if item is not None:
      term = item.findtext("name") or item.findtext("term")
      if term:
        return term
  return "General"


def is_passed(latest_text: str, bill: ET.Element) -> bool:
  law = bill.find("law")
  if law is not None and (law.findtext("number") or law.findtext("type")):
    return True
  latest_lower = latest_text.lower()
  return any(keyword.lower() in latest_lower for keyword in PASSED_KEYWORDS)


def resolve_status_label(latest_text: str, passed: bool) -> str:
  text = (latest_text or "").lower()
  if passed:
    return "Enacted"
  if "passed the house" in text or "passed the senate" in text:
    return "Passed Chamber"
  if "committee" in text or "referred" in text:
    return "In Committee"
  if "introduced" in text:
    return "Introduced"
  if "reported" in text:
    return "Reported"
  return "Active"


def build_tags(category: str, status_label: str, bill: ET.Element) -> List[str]:
  tags = {category, status_label}
  bill_type = bill.findtext("type")
  if bill_type:
    tags.add(bill_type.upper())
  chamber = bill.findtext("originChamber")
  if chamber:
    tags.add(chamber)
  policy_area = bill.find("policyArea")
  if policy_area is not None:
    code = policy_area.findtext("code")
    if code:
      tags.add(code)
  congress = bill.findtext("congress")
  if congress:
    tags.add(f"{congress}th")
  return [tag for tag in tags if tag]


def find_text_url(bill: ET.Element) -> Optional[str]:
  text_versions = bill.find("textVersions")
  if text_versions is None:
    return None
  for item in text_versions.findall("item"):
    formats = item.find("formats")
    if formats is None:
      continue
    for fmt in formats.findall("item"):
      url = fmt.findtext("url") or ""
      if url.endswith(".xml"):
        return url
  return None


def fetch_plain_text(url: str) -> str:
  try:
    response = SESSION.get(url, timeout=15)
    response.raise_for_status()
    root = ET.fromstring(response.text)
  except Exception:
    return ""

  chunks: List[str] = []
  for elem in root.iter():
    text = (elem.text or "").strip()
    if text:
      chunks.append(text)
  joined = "\n".join(chunks)
  # keep file manageable
  return joined[:MAX_TEXT_LENGTH]


def normalize_record(bill: ET.Element, source: str, status_label: str, full_text: str) -> dict:
  title = bill.findtext("title") or "Untitled bill"
  introduced = bill.findtext("introducedDate") or ""
  latest = bill.find("latestAction")
  latest_text = latest.findtext("text") if latest is not None else ""
  summary = extract_summary(bill)
  summary_clean = summary.strip() or "Summary pending."
  latest_clean = latest_text.strip()
  if latest_clean and summary_clean.lower() != latest_clean.lower():
    combined_text = f"{summary_clean}\nLatest action: {latest_clean}"
  else:
    combined_text = summary_clean
  category = extract_policy_area(bill)
  tags = build_tags(category, status_label, bill)
  return {
    "source": source,
    "title": title,
    "state": "US",
    "category": category,
    "dateIntroduced": introduced,
    "text": full_text.strip() or combined_text.strip(),
    "status": status_label,
    "tags": tags,
    "excerpt": combined_text.strip(),
  }


def iterate_bills(congress: str, bill_types: List[str], max_number: int, missing_limit: int) -> Iterable[tuple[str, ET.Element]]:
  for bill_type in bill_types:
    misses = 0
    for number in range(1, max_number + 1):
      bill = fetch_bill(congress, bill_type, number)
      if bill is None:
        misses += 1
        if misses >= missing_limit:
          break
        continue
      misses = 0
      yield bill_type.upper(), bill


def merge(existing: List[dict], new_records: List[dict]) -> List[dict]:
  merged = list(existing)
  title_to_index = {bill["title"]: idx for idx, bill in enumerate(merged)}
  for record in new_records:
    idx = title_to_index.get(record["title"])
    if idx is not None:
      merged[idx].update({k: v for k, v in record.items() if k != "id"})
    else:
      title_to_index[record["title"]] = len(merged)
      merged.append(record)
  for idx, bill in enumerate(merged, start=1):
    bill["id"] = idx
  return merged


def collect(
  congress: str,
  bill_types: List[str],
  active_limit: int,
  passed_limit: int,
  max_number: int,
  missing_limit: int,
  delay: float
) -> List[dict]:
  active: List[dict] = []
  enacted: List[dict] = []

  for bill_type, bill in iterate_bills(congress, bill_types, max_number, missing_limit):
    latest = bill.find("latestAction")
    latest_text = latest.findtext("text") if latest is not None else ""
    is_enacted = is_passed(latest_text, bill)
    status_label = resolve_status_label(latest_text, is_enacted)
    text_url = find_text_url(bill)
    full_text = fetch_plain_text(text_url) if text_url else ""
    record = normalize_record(bill, f"{congress}-{bill_type}", status_label, full_text)

    if is_enacted or status_label == "Enacted":
      if len(enacted) < passed_limit:
        enacted.append(record)
    else:
      if len(active) < active_limit:
        active.append(record)

    if len(active) >= active_limit and len(enacted) >= passed_limit:
      break

    # brief politeness delay to avoid hammering the service
    if delay > 0:
      time.sleep(delay)

  if len(active) < active_limit or len(enacted) < passed_limit:
    print(
      f"Warning: collected {len(active)} active and {len(enacted)} passed bills "
      f"(requested {active_limit} / {passed_limit}). Consider increasing --max-number."
    )

  return active + enacted


def main(args: argparse.Namespace) -> int:
  if not BILLS_PATH.exists():
    raise SystemExit(f"Could not find {BILLS_PATH}. Run from repository root.")

  bill_types = [bill_type.strip().lower() for bill_type in args.types.split(",") if bill_type.strip()]
  congresses = [value.strip() for value in args.congresses.split(",") if value.strip()]
  if not congresses:
    raise SystemExit("Provide at least one congress via --congresses.")

  new_records: List[dict] = []
  for congress in congresses:
    new_records.extend(
      collect(
        congress=congress,
        bill_types=bill_types,
        active_limit=args.active_limit,
        passed_limit=args.passed_limit,
        max_number=args.max_number,
        missing_limit=args.missing_limit,
        delay=args.delay,
      )
    )

  existing = json.loads(BILLS_PATH.read_text())
  merged = merge(existing, new_records)
  BILLS_PATH.write_text(json.dumps(merged, indent=2))
  print(f"Scraped {len(new_records)} new bills ({len(merged)} total entries).")
  return 0


if __name__ == "__main__":
  parser = argparse.ArgumentParser(description="Scrape bill summaries from GovInfo bulk data")
  parser.add_argument("--congresses", default="118,117", help="Comma-separated congress numbers (e.g., 118,117)")
  parser.add_argument("--types", default="hr,s,hjres,sjres", help="Comma-separated bill types to scan")
  parser.add_argument("--active-limit", type=int, default=6, help="Target count of in-progress bills per congress")
  parser.add_argument("--passed-limit", type=int, default=6, help="Target count of recently passed/enacted bills per congress")
  parser.add_argument("--max-number", type=int, default=400, help="Highest bill number to scan for each type")
  parser.add_argument("--missing-limit", type=int, default=60, help="Stop scanning a bill type after this many consecutive misses")
  parser.add_argument("--delay", type=float, default=0.15, help="Seconds to wait between requests (set 0 to disable)")
  raise SystemExit(main(parser.parse_args()))
