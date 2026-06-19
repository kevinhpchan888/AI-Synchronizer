# audiobook-prep

## When to load

- User wants to convert a written book/guide into an audiobook-ready manuscript
- User is preparing text for ElevenLabs, Voicebox, or any TTS engine
- User needs pronunciation, pacing, or SSML markup for spoken narration
- Trigger phrases: "audiobook manuscript", "TTS prep", "prepare for narration", "pronunciation for audio"

## Core Principle

**Written text is not spoken text.** A well-formatted PDF or EPUB reads beautifully on screen but sounds robotic, confusing, or unnatural when fed raw into a TTS engine. This skill transforms written prose into narration-ready scripts that sound human when synthesized.

## What This Skill Produces

```
output/audiobook/
  00_front_matter.txt       # Title, copyright spoken naturally
  01_chapter_01.txt         # Each chapter as a separate file
  02_chapter_02.txt         # ...
  ...
  30_chapter_30.txt
  pronunciation_dict.txt    # Master pronunciation reference (PLS-compatible)
  manifest.json             # Metadata: chapter titles, word counts, char counts, chunk info
```

Each chapter file contains narration-ready text with:
- All numbers expanded to spoken form
- Abbreviations and acronyms resolved
- SSML tags for pronunciation, pauses, and emphasis
- Visual-only content stripped (page numbers, figure references, headers/footers)
- Structural pauses at section breaks
- Chunks delimited by `<!-- CHUNK n -->` markers (max 5,000 chars each)

## ElevenLabs Limits (as of 2026)

| Model | Max chars/request |
|-------|------------------|
| Flash v2.5 | 40,000 |
| Turbo v2 | 30,000 |
| Multilingual v2 | 10,000 |
| Eleven v3 | 5,000 |

**Target chunk size: 4,800 characters** (safe margin below 5,000 for all models).

Studio (long-form): 5,000 chars/paragraph, 400 paragraphs/chapter. No hard cap on project size.

## SSML Support

Supported on Flash v2, Turbo v2, English v1 (NOT Eleven v3):

```xml
<break time="1.0s" />              <!-- Pause up to 3s -->
<phoneme alphabet="cmu-arpabet" ph="HH IH1 P AA0">HIPAA</phoneme>
<emphasis level="strong">critical</emphasis>
<prosody rate="slow" pitch="+5%">Take your time with this.</prosody>
```

**For Eleven v3 compatibility (no SSML):** Use text-based cues:
- `...` for hesitant/reflective pauses
- `---` for dramatic pauses
- ALL CAPS sparingly for emphasis
- Commas and periods for natural rhythm

## Transformation Rules

### 1. Numbers and Currency

| Written | Spoken |
|---------|--------|
| 328 | three hundred twenty-eight |
| $4,500 | forty-five hundred dollars |
| 72 hours | seventy-two hours |
| 3-5 days | three to five days |
| 10% | ten percent |
| 1:1 | one to one |
| 24/7 | twenty-four seven |
| 6x9 | six by nine |
| 1st, 2nd, 3rd | first, second, third |
| 2026 (year) | twenty twenty-six |
| (800) 555-1234 | eight hundred, five five five, one two three four |

### 2. Abbreviations and Acronyms

| Written | Spoken | Rule |
|---------|--------|------|
| Dr. | Doctor | Always expand titles |
| vs. | versus | Always expand |
| e.g. | for example | Always expand |
| i.e. | that is | Always expand |
| etc. | et cetera | Expand or rephrase |
| U.S. | U.S. (spoken as letters) | Keep as-is, TTS handles |
| HIPAA | <phoneme>HIP-ah</phoneme> | Phoneme tag |
| VA | V-A | Spell out |
| POA | P-O-A | Spell out |
| DNR | D-N-R | Spell out |
| POLST | <phoneme>POHLST</phoneme> | Phoneme tag |
| SSDI | S-S-D-I | Spell out |
| ICU | I-C-U | Spell out |
| ER | E-R | Spell out |
| ADL | A-D-L | Spell out |
| LTC | long-term care | Expand on first use |
| RN | R-N | Spell out |
| MD | M-D | Spell out |
| OT | O-T | Spell out |
| PT | P-T | Spell out |
| SNF | skilled nursing facility | Expand always |
| ALF | assisted living facility | Expand always |
| CCRC | C-C-R-C | Spell out |
| CMS | C-M-S | Spell out |
| APS | A-P-S | Spell out |

### 3. Punctuation as Pacing

| Mark | Effect |
|------|--------|
| Period (.) | Full stop, natural breath |
| Comma (,) | Brief pause |
| Semicolon (;) | Medium pause, slightly longer than comma |
| Em dash | Pause with emphasis shift --- convert to comma or period |
| Ellipsis (...) | Reflective pause, trailing thought |
| Colon (:) | Setup pause before a list or explanation |
| Parenthetical () | Slight drop in energy, aside tone |

### 4. Structural Elements

| Element | Handling |
|---------|----------|
| Chapter title | Spoken: "Chapter [number]. [Title]." + 2s break |
| Section heading | 1.5s break before, speak heading, 1s break after |
| Bullet lists | Convert to flowing sentences or "First... Second... Third..." |
| Numbered lists | "Number one... Number two..." with pauses |
| Block quotes | 0.5s break, slight pace change, 0.5s break after |
| Footnotes/endnotes | Omit entirely or weave into body text |
| Page numbers | Strip |
| Running headers/footers | Strip |
| Figure references | "As shown in the illustration" or strip if not essential |
| URLs/links | Omit or say "visit the link in the written guide" |
| Tables | Convert to prose: "The first option is X, which costs Y..." |
| Decorative elements (stars, dividers) | Replace with 1.5s pause |

### 5. Tone and Delivery Cues

For sections that need specific delivery:
- Opening/italic passages: mark with `[warm, slightly slower]`
- Statistics/data: mark with `[clear, measured pace]`
- Emotional content (grief, death, crisis): mark with `[gentle, unhurried]`
- Action items/checklists: mark with `[direct, steady]`
- Callout boxes: mark with `[emphasis, slight pause before and after]`

### 6. American English Pronunciation

| Word/Phrase | Note |
|-------------|------|
| caregiver | KAIR-giv-er (not CARE-GIV-er) |
| palliative | PAL-ee-uh-tiv (American standard) |
| Medicaid | MED-ih-kaid |
| Medicare | MED-ih-kair |
| hospice | HOSS-piss |
| respite | RESS-pit |
| dementia | dih-MEN-shuh |
| fiduciary | fih-DOO-shee-air-ee |
| durable | DUR-uh-bull |
| executor | ig-ZEK-yoo-ter |
| intestate | in-TEST-ayt |
| probate | PRO-bayt |
| geriatrician | jair-ee-uh-TRISH-un |
| neurologist | noor-AH-luh-jist |
| ombudsman | AHM-budz-man |
| Power of Attorney | (full phrase, never abbreviate in speech on first use) |

## Chunking Strategy

1. Never break mid-sentence
2. Never break mid-paragraph if avoidable
3. Prefer breaking at section boundaries (after headings, between topic shifts)
4. Each chunk: 3,000-4,800 characters (target 4,000 for comfortable margin)
5. Mark chunks with `<!-- CHUNK n -->` delimiter
6. Include 0.5s break at chunk boundaries for seamless stitching

## Script: build_audiobook_manuscript.py

Location: Same directory as the source PDF.

```
python build_audiobook_manuscript.py
```

Reads the PDF, applies all transformation rules, outputs chunked chapter files into `output/audiobook/`.

## Quality Passes

After generation, verify:
1. **No raw numbers** remaining (grep for digit sequences)
2. **No abbreviations** remaining unexpanded (grep for common patterns)
3. **No visual-only content** (page numbers, "see figure", footnote markers)
4. **Chunk sizes** all under 4,800 chars
5. **Chapter continuity** -- last sentence of chunk N flows into first sentence of chunk N+1
6. **Pronunciation dict** covers all domain-specific terms

## Anti-patterns

- Do NOT modify the source PDF
- Do NOT include image descriptions unless essential to understanding
- Do NOT add narrator commentary ("as we discussed in chapter 3")
- Do NOT expand well-known acronyms that sound natural (USA, FBI, CEO)
- Do NOT over-tag with SSML -- less is more, let punctuation do the work
- Do NOT split contractions or natural speech patterns into formal forms
