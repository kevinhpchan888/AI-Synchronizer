# APC Content Rules (Consolidated)

These rules apply to ALL content generated for agingparent.care — articles, homepage copy, product descriptions, emails, newsletters, and any customer-facing text.

## Voice & Tone

**Style models**: Atul Gawande (Being Mortal) for prose, Joan Didion for grief content.

**Tone**: Nurturing but direct. Not patronizing. Not clinical. Not cheerful. Assume the reader is stressed, overwhelmed, and time-poor. Write like a trusted friend who has been through it.

**Named characters**: Use as a tool, not a requirement. When used, full first names (not initials). They ground abstract advice in human moments.

**Rhythm**: Mix sentence lengths. Short sentences carry weight. Longer sentences add context and nuance. Never three long sentences in a row.

### Banned Words
delve, navigate, realm, crucial, utilize, facilitate, comprehensive (in openings), leverage (as verb), synergy, paradigm, optimize (for human emotions), empower, foster, robust (for emotions), streamline, holistic, embark, unpack, deep dive, at the end of the day, touch base, circle back, move the needle, low-hanging fruit, game-changer

### Banned Openings
Never start articles with: "In the world of...", "When it comes to...", "In today's...", "As we all know...", "It goes without saying...", "Let's face it..."

### Hard Formatting Rules
- **NEVER use em dashes (U+2014)** anywhere. Replace with periods, commas, colons, or parentheses. En dashes for ranges are fine.
- Newsletter derivatives: 200-300 words
- Website copy: 50-100 words per block

## Product Messaging: Outcome-First Rule

All product descriptions, short descriptions, and feature highlights (pros) must lead with outcomes, not content metrics.

**The test**: Read the opening of any product description. Does it describe what the reader HAS AFTER buying, or what the product CONTAINS? If it leads with content (pages, chapters, templates, hours), rewrite it.

**Wrong:**
- "Over 350 pages, 30 chapters, 140+ illustrations."
- "20 fillable templates for documents and care records."
- "Nearly 11 hours. Professionally narrated."

**Right:**
- "The plan families need before the next crisis."
- "The information families spend years trying to locate. Organized, written down, and ready when anyone asks."
- "The full 30-chapter Guide narrated for families who are always in motion."

**Where content metrics belong**: Metrics (page counts, chapter counts, template counts, hours) stay in product descriptions — they are proof and they justify the price. They must not be stripped out. The rule is about ORDER and framing, not removal: outcomes lead, metrics follow as support. In compact formats (subtitle lines, spec bullets), pair a key metric with a short descriptive phrase rather than listing bare numbers alone. "20 FILLABLE TEMPLATES • ORGANIZED FOR HOW CAREGIVING WORKS" is correct. "20 FILLABLE TEMPLATES • DIGITAL PDF" is not — the second bullet is redundant format info, not description. "THE INFORMATION CAREGIVING RUNS ON" with no metrics is also wrong — metrics are missing entirely.

**The anchor question**: After buying this, what is true for families that was not true before? That answer is the opening line.

**Pros field rule**: Each pro label must name an outcome or situation, not a feature. "Ready When Anyone Asks" not "20 Fillable Templates." "For the Time Between Everything Else" not "Listen While Driving."

**Short description rule** (the meta description shown in listings and search): One sentence naming what changes after purchase, followed optionally by one credibility sentence. Maximum 160 characters.

## Illustration Rules (Tomi Um Style)

**Prompt schema** (every illustration follows this exact format):
```
Warm editorial illustration in the style of Tomi Um. [Scene description]. Hand-drawn warm sienna and sepia ink linework, painterly watercolor washes on warm cream paper. Soft honey, warm amber, and sage green palette with cream highlights, gentle natural tones. No visible text, no lettering, no legible words anywhere in the image.
```

**Negative prompt** (always include):
```
no text, no watermark, no logos, no lettering, no writing, no words, no readable text, no photographic realism, no flat vector clip-art, no 3D render, no plastic skin, no oversaturated colors, no distinct facial features
```

**Generator**: NanoBanana Pro | **Quality**: 4x | **Aspect ratios**: 16:9, 4:3, 1:1, 3:4, 9:16 (ONLY these five)

**Figure direction**: All human figures must have NO DISTINCT FACIAL FEATURES. Use: seen from behind, high-angle/overhead, silhouetted, hands-only, three-quarter turned away.

**Text prevention**: No readable text surfaces. Use closed folders, sealed envelopes, face-down papers, screen-off phones. See `illustration_prompt_rules.md` in AgentDonny memory for the full banned-phrase list and substitution guide.

**Two illustrations per article**: Starting (emotional opening) + Midpoint (shift toward agency/resolve). Must be complementary pair, never duplicate.

## Citations & Disclaimer

Every article needs:
1. **Sources section**: Numbered, linked references at the bottom
2. **Standard disclaimer**: "The information in this article is for educational and informational purposes only..."

**4-round revision**: data accuracy, citations, AI language scrub, final read.

## Blog Category IDs
| ID | Category |
|----|----------|
| 7926 | Emotional Health |
| 7921 | Financial |
| 7925 | Family |
| 7924 | Medical |
| 7927 | Getting Started |
| 7923 | Housing |
| 7922 | Legal |
