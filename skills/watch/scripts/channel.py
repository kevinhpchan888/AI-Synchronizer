#!/usr/bin/env python3
"""Channel-batch mode for /watch: enumerate a channel/playlist and transcribe
the N most recent videos transcript-first (no frame extraction, no video
download), emitting one slim report.md per video for Claude to fill + stage
into the vault.

Cheap by design: it pulls captions only (yt-dlp --skip-download). The heavy
frame analysis of single-video /watch is intentionally skipped — use
`watch.py <url>` on an individual video when the visuals matter.

Usage:
  channel.py <channel-or-playlist-url> [--limit N] [--out-dir DIR]
             [--intent STR] [--whisper-fallback] [--whisper groq|openai]

Reuses download._pick_subtitle, transcribe.parse_vtt/format_transcript, and
(only when --whisper-fallback) whisper.transcribe_video.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from download import _pick_subtitle, is_url  # noqa: E402
from transcribe import format_transcript, parse_vtt  # noqa: E402

SUB_LANGS = "en,en-US,en-GB,en-orig"


def slugify(text: str, max_len: int = 60) -> str:
    text = (text or "untitled").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return (text[:max_len].rstrip("-")) or "untitled"


def enumerate_videos(url: str, limit: int) -> list[dict]:
    """Flat-list the most recent `limit` videos without downloading anything."""
    if shutil.which("yt-dlp") is None:
        raise SystemExit("yt-dlp is not installed. Run scripts/setup.py.")
    cmd = [
        "yt-dlp", "--flat-playlist", "--ignore-errors", "--no-warnings",
        "--playlist-end", str(limit),
        "--print", "%(id)s\t%(title)s\t%(upload_date)s",
        "--", url,
    ]
    out = subprocess.run(cmd, capture_output=True, text=True)
    videos: list[dict] = []
    for line in out.stdout.splitlines():
        parts = line.split("\t")
        if not parts or not parts[0].strip():
            continue
        vid = parts[0].strip()
        title = parts[1].strip() if len(parts) > 1 else vid
        upload = parts[2].strip() if len(parts) > 2 else ""
        if upload and len(upload) == 8 and upload.isdigit():
            upload = f"{upload[:4]}-{upload[4:6]}-{upload[6:]}"
        videos.append({"id": vid, "title": title, "upload_date": upload})
    if not videos:
        raise SystemExit(
            f"yt-dlp returned no videos for {url}\n{out.stderr.strip()[:500]}"
        )
    return videos


def fetch_captions(video_url: str, work: Path) -> Path | None:
    """Pull captions only (manual then auto), no video download."""
    work.mkdir(parents=True, exist_ok=True)
    cmd = [
        "yt-dlp", "--skip-download",
        "--write-subs", "--write-auto-subs",
        "--sub-langs", SUB_LANGS, "--sub-format", "vtt", "--convert-subs", "vtt",
        "--ignore-errors", "--no-warnings",
        "-o", str(work / "video.%(ext)s"),
        "--", video_url,
    ]
    subprocess.run(cmd, stdout=sys.stderr, stderr=sys.stderr)
    return _pick_subtitle(work)


def whisper_transcript(video_url: str, work: Path, backend: str | None) -> list[dict]:
    """Fallback: download the smallest audio and Whisper it."""
    from whisper import transcribe_video  # local import; only when needed
    audio_dl = work / "audio.m4a"
    cmd = [
        "yt-dlp", "-f", "bestaudio/best", "-x", "--audio-format", "m4a",
        "--ignore-errors", "--no-warnings",
        "-o", str(work / "audio.%(ext)s"), "--", video_url,
    ]
    subprocess.run(cmd, stdout=sys.stderr, stderr=sys.stderr)
    got = next((p for p in work.glob("audio.*")), None)
    if got is None:
        return []
    segments, _ = transcribe_video(str(got), work / "audio16k.wav", backend=backend)
    return segments


REPORT_TEMPLATE = """---
title: "{title}"
channel: "{channel}"
source: "{url}"
video_id: "{vid}"
upload_date: "{upload}"
watched: "{today}"
intent: "{intent}"
transcript_source: {tsource}
mode: channel-batch
---

# {title}

## TL;DR
<!-- pending Claude fill: 3-5 bullets through the lens of the intent above -->

## Key points
<!-- pending Claude fill: 5-8 timestamped bullets from the transcript -->

## Quotable moments
<!-- pending Claude fill: top 3 standalone lines, with [MM:SS] -->

## Concepts & entities
<!-- pending Claude fill: frameworks, people, companies, tools mentioned -->

## Transcript
{transcript}
"""


def load_registry(path: str | None) -> dict:
    """Load channels.json (the 'where to look' registry). Missing file → empty."""
    p = Path(path).expanduser() if path else (Path(__file__).resolve().parent.parent / "channels.json")
    reg: dict = {}
    if p.exists():
        try:
            reg = json.loads(p.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"[watch] registry parse failed ({p}): {exc}", file=sys.stderr)
    reg["_path"] = str(p)
    return reg


def _is_placeholder(ch: dict) -> bool:
    return ch.get("name", "").startswith("EXAMPLE") or "CHANNEL_HANDLE" in ch.get("url", "")


def _handle_name(target: str) -> str:
    m = re.search(r"@([A-Za-z0-9_.-]+)", target)
    if m:
        return m.group(1)
    m = re.search(r"youtube\.com/(?:c/|channel/|user/)?([A-Za-z0-9_.-]+)", target)
    return m.group(1) if m else "channel"


def resolve_targets(args, registry: dict) -> list[dict]:
    """Turn CLI args + registry into a list of {name, url, limit, intent}."""
    dlimit = args.limit or registry.get("default_limit", 10)
    dintent = args.intent if args.intent is not None else registry.get("default_intent", "")
    channels = [c for c in registry.get("channels", []) if not _is_placeholder(c)]

    def mk(ch: dict) -> dict:
        return {
            "name": ch["name"],
            "url": ch["url"],
            "limit": args.limit or ch.get("limit") or dlimit,
            "intent": args.intent if args.intent is not None else ch.get("intent") or dintent,
        }

    if args.all:
        return [mk(c) for c in channels]
    if not args.target:
        return []
    tgt = args.target.strip()
    if is_url(tgt) or tgt.startswith("@") or "youtube.com/" in tgt:
        return [{"name": _handle_name(tgt), "url": tgt, "limit": dlimit, "intent": dintent}]
    # treat as a registry channel name (exact, then substring, case-insensitive)
    low = tgt.lower()
    match = next((c for c in channels if c["name"].lower() == low), None) \
        or next((c for c in channels if low in c["name"].lower()), None)
    if match:
        return [mk(match)]
    print(f"[watch] '{tgt}' is not a URL and not in the registry ({registry.get('_path')}). "
          f"Known: {[c['name'] for c in channels] or 'none'}", file=sys.stderr)
    return []


def scan_videos(videos: list[dict], cdir: Path, channel_name: str, intent: str,
                whisper_fallback: bool, whisper: str | None) -> list[dict]:
    """Transcribe each video into cdir/<slug>/report.md. Returns result dicts."""
    today = date.today().isoformat()
    results = []
    for n, v in enumerate(videos, 1):
        video_url = f"https://www.youtube.com/watch?v={v['id']}"
        slug = f"{slugify(v['title'])}-{v['upload_date'] or today}"
        vdir = cdir / slug
        vdir.mkdir(parents=True, exist_ok=True)
        print(f"[watch] [{n}/{len(videos)}] {v['title'][:70]}", file=sys.stderr)

        tsource, segments = "none", []
        vtt = fetch_captions(video_url, vdir)
        if vtt:
            try:
                segments = parse_vtt(str(vtt))
                tsource = "captions"
            except Exception as exc:
                print(f"[watch]   caption parse failed: {exc}", file=sys.stderr)
        if not segments and whisper_fallback:
            try:
                segments = whisper_transcript(video_url, vdir, whisper)
                tsource = f"whisper-{whisper or 'auto'}" if segments else "none"
            except SystemExit as exc:
                print(f"[watch]   whisper fallback skipped: {exc}", file=sys.stderr)

        transcript_md = format_transcript(segments) if segments else \
            "_No transcript available (no captions; Whisper fallback off or failed)._"
        report = REPORT_TEMPLATE.format(
            title=v["title"].replace('"', "'"), channel=channel_name.replace('"', "'"),
            url=video_url, vid=v["id"], upload=v["upload_date"], today=today,
            intent=(intent or "").replace('"', "'"), tsource=tsource, transcript=transcript_md,
        )
        (vdir / "report.md").write_text(report, encoding="utf-8")
        results.append({"slug": slug, "title": v["title"], "url": video_url,
                        "upload_date": v["upload_date"], "transcript_source": tsource,
                        "report": str(vdir / "report.md")})
    return results


def main() -> int:
    ap = argparse.ArgumentParser(description="Transcribe the N most recent videos of a channel/playlist, or every channel in the registry.")
    ap.add_argument("target", nargs="?", default=None,
                    help="A channel URL / @handle / playlist URL, OR a registry channel 'name'. Omit with --all.")
    ap.add_argument("--all", action="store_true", help="Scan every channel in the registry")
    ap.add_argument("--registry", default=None, help="Path to channels.json (default: skill's channels.json)")
    ap.add_argument("--limit", type=int, default=None, help="How many recent videos (default: registry/10)")
    ap.add_argument("--out-dir", default=None, help="Working dir (default: tmp)")
    ap.add_argument("--intent", default=None, help="Why you're scanning — shapes each TL;DR")
    ap.add_argument("--whisper-fallback", action="store_true",
                    help="When a video has no captions, download audio and Whisper it (slower, costs API)")
    ap.add_argument("--whisper", choices=["groq", "openai"], default=None)
    args = ap.parse_args()

    registry = load_registry(args.registry)
    targets = resolve_targets(args, registry)
    if not targets:
        print("[watch] nothing to scan. Pass a channel URL/name, or --all with a populated "
              f"channels.json. Registry: {registry.get('_path')}", file=sys.stderr)
        return 2

    work = Path(args.out_dir).expanduser().resolve() if args.out_dir else Path(tempfile.mkdtemp(prefix="watch-ch-"))
    work.mkdir(parents=True, exist_ok=True)
    vault_folder = registry.get("vault_folder", "Watched Videos")

    all_results = []
    for t in targets:
        cname = t["name"]
        print(f"[watch] channel scan → {cname}  ({t['url']})", file=sys.stderr)
        cdir = work / slugify(cname)
        try:
            videos = enumerate_videos(t["url"], t["limit"])
        except SystemExit as exc:
            print(f"[watch] skip '{cname}': {exc}", file=sys.stderr)
            continue
        print(f"[watch] {len(videos)} videos (limit {t['limit']})", file=sys.stderr)
        vids = scan_videos(videos, cdir, cname, t["intent"], args.whisper_fallback, args.whisper)
        all_results.append({"channel": cname, "url": t["url"], "vault_subfolder": slugify(cname),
                            "count": len(vids), "videos": vids})

    manifest = {"workdir": str(work), "vault_folder": vault_folder,
                "channels": all_results}
    (work / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    # stdout = what Claude reads
    total = sum(c["count"] for c in all_results)
    print(f"\nCHANNEL SCAN COMPLETE — {len(all_results)} channel(s), {total} videos, workdir: {work}")
    print(f"vault destination: {vault_folder}/<channel>/<video>/\n")
    for c in all_results:
        print(f"  # {c['channel']}  ->  {vault_folder}/{c['vault_subfolder']}/")
        for r in c["videos"]:
            print(f"      [{r['transcript_source']:>14}]  {r['upload_date'] or '????-??-??'}  {r['report']}")
    print(f"\nmanifest: {work / 'manifest.json'}")
    print(f"\nNext: read each report.md, fill the pending markers from its transcript, then stage "
          f"each into the vault at {vault_folder}/<channel>/<video>/ per the SKILL channel-mode steps.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
