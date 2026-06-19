#!/usr/bin/env python3
"""
reddit_backend.py — anonymous Reddit JSON-endpoint research.

No auth, no PRAW, no API key. Hits old.reddit.com/<path>.json with a polite
User-Agent and a self-imposed rate limit. Designed to fail loudly when Reddit
tightens rules so you fall back to manual site:reddit.com Google search.

Usage:
    python reddit_backend.py search "posture corrector" --limit 50
    python reddit_backend.py sub r/posture --sort top --time year --limit 100
    python reddit_backend.py thread <permalink-or-id> --comments
    python reddit_backend.py user <username> --limit 50

Output: JSON to stdout, or --csv for flat CSV.
"""

import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request

UA = "DonnyResearchBot/1.0 (read-only; contact kevinhpchan@gmail.com)"
MIN_INTERVAL = 1.1  # seconds between requests (~55 req/min, under the 60/min limit)
_LAST_CALL = [0.0]


def _throttle():
    elapsed = time.time() - _LAST_CALL[0]
    if elapsed < MIN_INTERVAL:
        time.sleep(MIN_INTERVAL - elapsed)
    _LAST_CALL[0] = time.time()


def _get(url):
    _throttle()
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status == 429:
                raise RuntimeError("429 rate-limited — back off and retry, or fall back to manual Google search")
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 429:
            raise RuntimeError("429 rate-limited — back off and retry, or fall back to manual Google search")
        if e.code == 403:
            raise RuntimeError("403 forbidden — Reddit may be blocking anonymous JSON access; fall back to manual")
        raise


def search(query, limit=50, sort="relevance", time_filter="all", subreddit=None):
    """Search Reddit globally or within a subreddit. Returns list of post dicts."""
    base = f"https://old.reddit.com/r/{subreddit}/search.json" if subreddit else "https://old.reddit.com/search.json"
    params = {
        "q": query,
        "limit": min(limit, 100),
        "sort": sort,
        "t": time_filter,
        "restrict_sr": "on" if subreddit else "off",
    }
    posts = []
    after = None
    while len(posts) < limit:
        if after:
            params["after"] = after
        url = base + "?" + urllib.parse.urlencode(params)
        data = _get(url)
        children = data.get("data", {}).get("children", [])
        if not children:
            break
        for c in children:
            d = c["data"]
            posts.append({
                "id": d.get("id"),
                "subreddit": d.get("subreddit"),
                "title": d.get("title"),
                "selftext": d.get("selftext", "")[:2000],
                "score": d.get("score"),
                "num_comments": d.get("num_comments"),
                "created_utc": d.get("created_utc"),
                "permalink": "https://reddit.com" + d.get("permalink", ""),
                "author": d.get("author"),
                "url": d.get("url"),
            })
        after = data.get("data", {}).get("after")
        if not after:
            break
    return posts[:limit]


def sub_listing(sub, sort="top", time_filter="year", limit=100):
    """Pull posts from a subreddit by sort (top, hot, new, rising, controversial)."""
    sub = sub.lstrip("r/").lstrip("/")
    base = f"https://old.reddit.com/r/{sub}/{sort}.json"
    params = {"limit": min(limit, 100), "t": time_filter}
    posts = []
    after = None
    while len(posts) < limit:
        if after:
            params["after"] = after
        url = base + "?" + urllib.parse.urlencode(params)
        data = _get(url)
        children = data.get("data", {}).get("children", [])
        if not children:
            break
        for c in children:
            d = c["data"]
            posts.append({
                "id": d.get("id"),
                "subreddit": d.get("subreddit"),
                "title": d.get("title"),
                "selftext": d.get("selftext", "")[:2000],
                "score": d.get("score"),
                "num_comments": d.get("num_comments"),
                "created_utc": d.get("created_utc"),
                "permalink": "https://reddit.com" + d.get("permalink", ""),
                "author": d.get("author"),
            })
        after = data.get("data", {}).get("after")
        if not after:
            break
    return posts[:limit]


def thread(thread_id_or_url, with_comments=True, limit=500):
    """Fetch a thread and its comment tree. Returns {post: {...}, comments: [...]}."""
    if thread_id_or_url.startswith("http"):
        url = thread_id_or_url.rstrip("/") + ".json"
    else:
        url = f"https://old.reddit.com/comments/{thread_id_or_url}.json"
    if with_comments:
        url += ("&" if "?" in url else "?") + f"limit={limit}"
    data = _get(url)
    if not isinstance(data, list) or len(data) < 2:
        return {"error": "unexpected response shape"}
    post = data[0]["data"]["children"][0]["data"] if data[0]["data"]["children"] else {}
    comments = []

    def walk(node, depth=0):
        if node.get("kind") != "t1":
            return
        d = node.get("data", {})
        if d.get("body") and d.get("body") != "[deleted]":
            comments.append({
                "id": d.get("id"),
                "author": d.get("author"),
                "body": d.get("body"),
                "score": d.get("score"),
                "depth": depth,
                "created_utc": d.get("created_utc"),
                "parent_id": d.get("parent_id"),
            })
        replies = d.get("replies")
        if isinstance(replies, dict):
            for child in replies.get("data", {}).get("children", []):
                walk(child, depth + 1)

    for c in data[1]["data"]["children"]:
        walk(c)
    return {
        "post": {
            "id": post.get("id"),
            "title": post.get("title"),
            "selftext": post.get("selftext"),
            "subreddit": post.get("subreddit"),
            "score": post.get("score"),
            "permalink": "https://reddit.com" + post.get("permalink", ""),
            "author": post.get("author"),
        },
        "comments": comments,
    }


def user_history(username, limit=50):
    """Pull a user's recent posts and comments — for astroturf detection."""
    data = _get(f"https://old.reddit.com/user/{username}.json?limit={min(limit, 100)}")
    items = []
    for c in data.get("data", {}).get("children", []):
        d = c["data"]
        items.append({
            "kind": c.get("kind"),
            "subreddit": d.get("subreddit"),
            "body_or_title": d.get("body") or d.get("title"),
            "score": d.get("score"),
            "created_utc": d.get("created_utc"),
            "permalink": "https://reddit.com" + d.get("permalink", "") if d.get("permalink") else None,
        })
    return items


def to_csv(rows, out=sys.stdout):
    if not rows:
        return
    keys = sorted({k for r in rows for k in r.keys()})
    w = csv.DictWriter(out, fieldnames=keys)
    w.writeheader()
    for r in rows:
        w.writerow({k: r.get(k, "") for k in keys})


def main():
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)

    s = sp.add_parser("search")
    s.add_argument("query")
    s.add_argument("--subreddit")
    s.add_argument("--sort", default="relevance", choices=["relevance", "hot", "top", "new", "comments"])
    s.add_argument("--time", default="all", choices=["hour", "day", "week", "month", "year", "all"])
    s.add_argument("--limit", type=int, default=50)

    sub = sp.add_parser("sub")
    sub.add_argument("name")
    sub.add_argument("--sort", default="top", choices=["top", "hot", "new", "rising", "controversial"])
    sub.add_argument("--time", default="year", choices=["hour", "day", "week", "month", "year", "all"])
    sub.add_argument("--limit", type=int, default=100)

    th = sp.add_parser("thread")
    th.add_argument("id_or_url")
    th.add_argument("--no-comments", action="store_true")

    u = sp.add_parser("user")
    u.add_argument("username")
    u.add_argument("--limit", type=int, default=50)

    ap.add_argument("--csv", action="store_true")
    args = ap.parse_args()

    if args.cmd == "search":
        out = search(args.query, args.limit, args.sort, args.time, args.subreddit)
    elif args.cmd == "sub":
        out = sub_listing(args.name, args.sort, args.time, args.limit)
    elif args.cmd == "thread":
        out = thread(args.id_or_url, not args.no_comments)
    elif args.cmd == "user":
        out = user_history(args.username, args.limit)

    if args.csv and isinstance(out, list):
        to_csv(out)
    else:
        json.dump(out, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
