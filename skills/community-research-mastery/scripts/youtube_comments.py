#!/usr/bin/env python3
"""
youtube_comments.py — pull comments from a YouTube video using Data API v3.

Free tier quota: 10,000 units/day. CommentThreads.list = 1 unit per call,
so this is cheap. Set YOUTUBE_API_KEY env var.

Usage:
    YOUTUBE_API_KEY=... python youtube_comments.py <video_url_or_id> --limit 200
    python youtube_comments.py <id> --order time   # newest first
"""

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request


def extract_video_id(s):
    if len(s) == 11 and re.match(r"^[A-Za-z0-9_-]{11}$", s):
        return s
    m = re.search(r"(?:v=|/shorts/|/embed/|youtu\.be/)([A-Za-z0-9_-]{11})", s)
    if m:
        return m.group(1)
    return s


def fetch(api_key, video_id, limit=200, order="relevance"):
    base = "https://www.googleapis.com/youtube/v3/commentThreads"
    out = []
    page_token = None
    while len(out) < limit:
        params = {
            "part": "snippet,replies",
            "videoId": video_id,
            "maxResults": min(100, limit - len(out)),
            "order": order,
            "textFormat": "plainText",
            "key": api_key,
        }
        if page_token:
            params["pageToken"] = page_token
        url = base + "?" + urllib.parse.urlencode(params)
        with urllib.request.urlopen(url, timeout=20) as r:
            data = json.loads(r.read().decode("utf-8"))
        for item in data.get("items", []):
            top = item["snippet"]["topLevelComment"]["snippet"]
            entry = {
                "author": top.get("authorDisplayName"),
                "text": top.get("textDisplay"),
                "like_count": top.get("likeCount"),
                "published_at": top.get("publishedAt"),
                "reply_count": item["snippet"].get("totalReplyCount", 0),
                "replies": [],
            }
            for rep in item.get("replies", {}).get("comments", []):
                rs = rep["snippet"]
                entry["replies"].append({
                    "author": rs.get("authorDisplayName"),
                    "text": rs.get("textDisplay"),
                    "like_count": rs.get("likeCount"),
                    "published_at": rs.get("publishedAt"),
                })
            out.append(entry)
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return out[:limit]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", help="YouTube video URL or 11-char ID")
    ap.add_argument("--limit", type=int, default=200)
    ap.add_argument("--order", default="relevance", choices=["relevance", "time"])
    args = ap.parse_args()

    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        print(json.dumps({
            "error": "YOUTUBE_API_KEY env var not set",
            "instruction": "Get a free key at console.cloud.google.com -> enable YouTube Data API v3 -> Credentials. Set in env."
        }, indent=2))
        sys.exit(1)

    vid = extract_video_id(args.video)
    out = fetch(api_key, vid, args.limit, args.order)
    json.dump({"video_id": vid, "comment_count": len(out), "comments": out}, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
