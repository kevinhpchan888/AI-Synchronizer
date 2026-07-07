"""
ingest_manual_csv.py - Parse Google Trends manual CSV exports into SQLite.

For a human clicking through trends.google.com, Google downloads four CSV types:
    - multiTimeline.csv       (interest over time)
    - geoMap.csv              (regional breakdown)
    - relatedQueries.csv      (related queries, TOP and RISING)
    - relatedEntities.csv     (related topics)

This script parses all four and writes to a local SQLite database keyed by keyword.

Usage:
    python ingest_manual_csv.py --file ~/Downloads/multiTimeline.csv --keyword "posture corrector"
    python ingest_manual_csv.py --watch ~/Downloads/ --keyword "posture corrector"   # watch folder
    python ingest_manual_csv.py --dir ~/Downloads/ --keyword "posture corrector"     # ingest all in dir
"""

import argparse
import csv
import os
import re
import sqlite3
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


DB_PATH = os.path.expanduser("~/.dropship_trends.sqlite")


def init_db(path: str = DB_PATH) -> sqlite3.Connection:
    con = sqlite3.connect(path)
    cur = con.cursor()
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS interest_over_time (
            keyword TEXT,
            date TEXT,
            value INTEGER,
            source TEXT,
            ingested_at TEXT,
            PRIMARY KEY (keyword, date)
        );
        CREATE TABLE IF NOT EXISTS interest_by_region (
            keyword TEXT,
            region TEXT,
            value INTEGER,
            source TEXT,
            ingested_at TEXT,
            PRIMARY KEY (keyword, region)
        );
        CREATE TABLE IF NOT EXISTS related_queries (
            keyword TEXT,
            bucket TEXT,   -- 'top' or 'rising'
            query TEXT,
            value TEXT,    -- number for top, "Breakout" or N% for rising
            source TEXT,
            ingested_at TEXT,
            PRIMARY KEY (keyword, bucket, query)
        );
        CREATE TABLE IF NOT EXISTS related_topics (
            keyword TEXT,
            bucket TEXT,
            topic TEXT,
            value TEXT,
            source TEXT,
            ingested_at TEXT,
            PRIMARY KEY (keyword, bucket, topic)
        );
    """)
    con.commit()
    return con


def detect_csv_type(path: Path) -> Optional[str]:
    """
    Google Trends CSVs have a 2-3 row header banner. Detect by filename first,
    fall back to content sniffing.
    """
    name = path.name.lower()
    if "multitimeline" in name:
        return "iot"
    if "geomap" in name:
        return "geo"
    if "relatedqueries" in name:
        return "queries"
    if "relatedentities" in name or "relatedtopics" in name:
        return "topics"

    # Content sniff: read first 5 lines
    try:
        with open(path, "r", encoding="utf-8") as f:
            head = "".join(f.readline() for _ in range(5)).lower()
        if "week" in head or "month" in head and "Category:" in head:
            return "iot"
        if "country" in head or "region" in head:
            return "geo"
        if "top" in head or "rising" in head:
            return "queries"
    except Exception:
        pass
    return None


def _skip_header_banner(f) -> None:
    """Google Trends CSVs start with 2-3 banner rows. Skip until we find a line with commas and data."""
    pos = f.tell()
    while True:
        pos = f.tell()
        line = f.readline()
        if not line:
            return
        # Data rows have a comma and a number
        stripped = line.strip()
        if "," in stripped and any(c.isdigit() for c in stripped):
            # Also skip the section header like "TOP" or "RISING" alone on a line
            if stripped.upper() in ("TOP", "RISING"):
                continue
            f.seek(pos)
            return


def parse_iot(path: Path, keyword: str) -> List[Dict]:
    """Parse multiTimeline.csv: week,keyword_value."""
    out = []
    with open(path, "r", encoding="utf-8") as f:
        _skip_header_banner(f)
        reader = csv.reader(f)
        header_line = next(reader, None)
        if not header_line:
            return out
        # Header is like "Week" or "Month" followed by keyword column(s)
        for row in reader:
            if len(row) < 2:
                continue
            date_str = row[0].strip()
            # Normalize date
            try:
                if "-" in date_str and len(date_str) == 10:
                    d = datetime.strptime(date_str, "%Y-%m-%d")
                elif "-" in date_str and len(date_str) == 7:
                    d = datetime.strptime(date_str, "%Y-%m")
                else:
                    continue
            except ValueError:
                continue
            try:
                value = int(row[1].strip() or 0)
            except ValueError:
                continue
            out.append({"keyword": keyword, "date": d.strftime("%Y-%m-%d"), "value": value})
    return out


def parse_geo(path: Path, keyword: str) -> List[Dict]:
    """Parse geoMap.csv: country,keyword_value."""
    out = []
    with open(path, "r", encoding="utf-8") as f:
        _skip_header_banner(f)
        reader = csv.reader(f)
        next(reader, None)  # header
        for row in reader:
            if len(row) < 2:
                continue
            region = row[0].strip()
            try:
                value = int(row[1].strip() or 0)
            except ValueError:
                continue
            if region:
                out.append({"keyword": keyword, "region": region, "value": value})
    return out


def parse_queries(path: Path, keyword: str) -> List[Dict]:
    """
    Parse relatedQueries.csv. This file has TWO sections: TOP and RISING.
    Format:
        (blank lines)
        TOP,
        query,value
        query,value
        ...
        (blank)
        RISING,
        query,"Breakout"
        query,"+5,400%"
    """
    out = []
    current_bucket = None
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        upper = line.upper().rstrip(",").strip()
        if upper == "TOP":
            current_bucket = "top"
            continue
        if upper == "RISING":
            current_bucket = "rising"
            continue
        if current_bucket and "," in line:
            # Split on first comma, preserve rest (values may have commas)
            try:
                reader = csv.reader([line])
                parts = next(reader)
                if len(parts) < 2:
                    continue
                q = parts[0].strip()
                v = parts[1].strip()
                # Skip the header row "Query,Value" if it appears
                if q.lower() == "query" or q.lower().startswith("category"):
                    continue
                if q:
                    out.append({"keyword": keyword, "bucket": current_bucket, "query": q, "value": v})
            except Exception:
                continue
    return out


def insert_iot(con, rows: List[Dict], source: str = "manual_csv") -> int:
    now = datetime.now().isoformat()
    data = [(r["keyword"], r["date"], r["value"], source, now) for r in rows]
    con.executemany(
        "INSERT OR REPLACE INTO interest_over_time VALUES (?,?,?,?,?)", data
    )
    con.commit()
    return len(data)


def insert_geo(con, rows: List[Dict], source: str = "manual_csv") -> int:
    now = datetime.now().isoformat()
    data = [(r["keyword"], r["region"], r["value"], source, now) for r in rows]
    con.executemany(
        "INSERT OR REPLACE INTO interest_by_region VALUES (?,?,?,?,?)", data
    )
    con.commit()
    return len(data)


def insert_queries(con, rows: List[Dict], source: str = "manual_csv") -> int:
    now = datetime.now().isoformat()
    data = [(r["keyword"], r["bucket"], r["query"], r["value"], source, now) for r in rows]
    con.executemany(
        "INSERT OR REPLACE INTO related_queries VALUES (?,?,?,?,?,?)", data
    )
    con.commit()
    return len(data)


def ingest_file(con, path: Path, keyword: str) -> Tuple[str, int]:
    """Route a single file to the correct parser and inserter."""
    kind = detect_csv_type(path)
    if kind == "iot":
        rows = parse_iot(path, keyword)
        return ("interest_over_time", insert_iot(con, rows))
    if kind == "geo":
        rows = parse_geo(path, keyword)
        return ("interest_by_region", insert_geo(con, rows))
    if kind == "queries":
        rows = parse_queries(path, keyword)
        return ("related_queries", insert_queries(con, rows))
    if kind == "topics":
        # Same format as queries effectively
        rows = parse_queries(path, keyword)
        # Write to topics table though
        now = datetime.now().isoformat()
        data = [(r["keyword"], r["bucket"], r["query"], r["value"], "manual_csv", now) for r in rows]
        con.executemany(
            "INSERT OR REPLACE INTO related_topics VALUES (?,?,?,?,?,?)", data
        )
        con.commit()
        return ("related_topics", len(data))
    return ("unknown", 0)


def watch_directory(directory: Path, keyword: str, poll: int = 2) -> None:
    """Poll directory for new Google Trends CSVs."""
    print(f"Watching {directory} for Google Trends CSV exports...")
    print("Download CSVs from trends.google.com. Press Ctrl+C to stop.\n")
    seen = set()
    con = init_db()
    patterns = ("multiTimeline", "geoMap", "relatedQueries", "relatedEntities")
    while True:
        try:
            for f in directory.iterdir():
                if f.is_file() and any(p in f.name for p in patterns) and f.name not in seen:
                    # Give the browser a moment to finish writing
                    time.sleep(0.5)
                    kind, n = ingest_file(con, f, keyword)
                    print(f"[{datetime.now():%H:%M:%S}] Ingested {f.name} -> {kind} ({n} rows)")
                    seen.add(f.name)
            time.sleep(poll)
        except KeyboardInterrupt:
            print("\nStopping watcher.")
            return


def main() -> int:
    ap = argparse.ArgumentParser(description="Ingest manual Google Trends CSV exports")
    ap.add_argument("--file", type=Path, help="Single CSV to ingest")
    ap.add_argument("--dir", type=Path, help="Ingest all matching CSVs in a directory")
    ap.add_argument("--watch", type=Path, help="Watch a directory and auto-ingest")
    ap.add_argument("--keyword", required=True, help="Keyword these CSVs correspond to")
    args = ap.parse_args()

    con = init_db()

    if args.file:
        kind, n = ingest_file(con, args.file, args.keyword)
        print(f"Ingested {args.file.name} -> {kind} ({n} rows)")
    elif args.dir:
        patterns = ("multiTimeline", "geoMap", "relatedQueries", "relatedEntities")
        for f in args.dir.iterdir():
            if f.is_file() and any(p in f.name for p in patterns):
                kind, n = ingest_file(con, f, args.keyword)
                print(f"Ingested {f.name} -> {kind} ({n} rows)")
    elif args.watch:
        watch_directory(args.watch, args.keyword)
    else:
        ap.error("Pass --file, --dir, or --watch")

    con.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
