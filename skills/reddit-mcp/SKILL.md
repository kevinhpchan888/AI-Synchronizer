---
name: reddit-mcp
author: Kevin Chan (AMVPC)
version: 1.0.0
last_updated: 2026-06-15
description: "Canonical Reddit data access for ALL projects via the hosted reddit-research-mcp server (semantic discovery across 20,000+ subs, comment trees, citations) with anonymous JSON fallback. ALWAYS use for any Reddit need: VOC, pain points, hooks, sentiment, social listening, subreddit lookups, find threads about Y. Pairs with reddit-research-mastery."

---

# Reddit MCP — Always-On Reddit Access

## THE RULE (non-negotiable)

**Whenever a task needs Reddit data, you use this skill. Every time. No exceptions.**

Do not scrape Reddit by hand, do not rely on `WebSearch` for Reddit content (it returns SERP snippets, not thread bodies), and do not skip Reddit because "it's probably fine." If the work calls for what real people say, you pull it from Reddit through the MCP server below.

This applies to ALL execution contexts: manual sessions, the APC daily content routine, dropship research, subagent dispatches, batch jobs, and any automated pipeline.

## What this gives you that nothing else does

`WebSearch` cannot render Reddit thread or comment content — it only returns search-result snippets. The hosted **reddit-research-mcp** server can:

- **Semantic subreddit discovery** across 20,000+ indexed subs (finds niche communities you'd never guess)
- **Full comment-tree fetch** (the verbatim language caregivers/customers actually use)
- **Cross-subreddit aggregation** (bypasses Reddit's 250-result API cap)
- **Cited results** with upvote counts and direct URLs (satisfies the "no URL, no finding" rule)

## Setup (one time)

The server is hosted (no Reddit API keys, no local install). Add it once:

```
claude mcp add --transport http reddit-research https://reddit-research-mcp.fastmcp.app/mcp
```

Then authenticate once via the Descope OAuth prompt (~30 seconds, public Reddit data only). Source + docs: https://github.com/king-of-the-grackles/reddit-research-mcp

To confirm it's live in a session, run `ToolSearch` for `reddit` (or `mcp__reddit`) and load the tool schemas before calling.

## The tools (three-layer architecture)

The server uses a discover → schema → execute pattern. Load schemas with ToolSearch first.

| Layer | Tool | Use |
|---|---|---|
| 1. Discovery | `discover_operations()` | List available operations + recommended workflow |
| 2. Schema | `get_operation_schema(op)` | Get parameters, validation, examples for an operation |
| 3. Execute | `execute_operation(op, params)` | Run a validated operation |

Operations available through `execute_operation`:

- `discover_subreddits` — semantic vector search for relevant subreddits by topic
- `search_subreddit` — posts within a sub, with time/sort filters
- `fetch_posts` — posts by listing type (hot / new / top / rising)
- `fetch_multiple` — batch fetch across multiple subs concurrently (~70% more efficient)
- `fetch_comments` — **complete comment trees** (the gold-standard VOC source)
- Feed management: `create_feed`, `list_feeds`, `get_feed`, `update_feed`, `delete_feed` (save/monitor sub collections)

## The standard workflow (run this whenever you need Reddit signal)

> **Field note (verified 2026-06-15):** `discover_subreddits` semantic search DRIFTS on broad caregiving queries (it returned r/Nanny, r/2under2, r/ageregression for a caregiving query). For APC/caregiving work, SEED the known subs directly — r/AgingParents, r/dementia, r/CaregiverSupport, r/eldercare, r/AlzheimersGroup — via `fetch_multiple`/`search_subreddit`, and use `discover_subreddits` only to find additional niche communities. Verify any discovered sub is actually on-topic before mining it.
>
> **Headless auth (cloud/web sessions):** the server exposes `authenticate` + `complete_authentication`. Call `authenticate`, give the user the Descope URL, have them approve (the `localhost:<port>/callback` page will fail to load — expected), then paste the full callback URL back and call `complete_authentication(callback_url=...)`. Tools load after that. Token is session-scoped.

1. **Discover** the communities: `discover_subreddits(topic)` → keep the on-topic ones; for caregiving, seed the known subs above.
2. **Pull** what's live: `fetch_multiple(subs, listing=top, time=year)` and/or `search_subreddit(sub, query)` for the specific problem.
3. **Read the comments**: `fetch_comments` on the 3-6 highest-signal threads. This is where the verbatim language lives. Snippets are not enough; pull the trees.
4. **Triangulate** (the n=3 rule from `reddit-research-mastery`): a phrasing or pain point only counts as signal when it appears in **3+ comments across 3+ threads**. One comment is an anecdote.
5. **Cite everything**: capture the permalink + upvotes for each quote you'll use. No URL, no finding.
6. **Extract**, don't paraphrase: keep the actual words. The 4-upvote comment in the right thread beats a clever line written at a desk.

## Mining doctrine (read alongside this)

For HOW to interpret what you pull — the Joanna Wiebe "copy is mined not written" principle, the Schwartz "enter the conversation" frame, the astroturf assumption (trust complaints over praise), and the pain-extraction templates — invoke or read **`reddit-research-mastery`**. That skill is the methodology; this skill is the access layer. Use both together.

## Fallback (only if the MCP is down)

If `ToolSearch` finds no reddit MCP tools and `claude mcp add` can't connect, degrade gracefully in this order:
1. Run the anonymous JSON script: `python ~/.claude/skills/reddit-research-mastery/scripts/reddit_backend.py` (search / sub / thread --comments). It hits old.reddit.com JSON, no auth, self-throttled. Fails loudly on 403/429.
2. Only if that 403s, fall back to `WebSearch` with `site:reddit.com` — and explicitly flag in the output that Reddit thread bodies were NOT available and the finding is SERP-level only.

Never silently skip Reddit and never present SERP snippets as if they were thread content.

## Output contract

Whatever consumes your Reddit research (an article hook, an FAQ, an ad angle, a trend report) gets:
- The verbatim phrasings that recurred (with permalink + upvotes)
- The pain points / worries ranked by how often they appeared
- A one-line note on confidence (n=how many threads) and whether astroturf was a risk

## APC daily routine integration

The APC content engine (`daily-content-routine-v2.md`, Phase C) calls this skill to mine caregiver subs (r/AgingParents, r/dementia, r/CaregiverSupport, r/eldercare, plus whatever `discover_subreddits` surfaces) for the real language behind each candidate topic. The hook line and the FAQ questions should come from how caregivers actually phrase the problem, not from how publishers headline it.
