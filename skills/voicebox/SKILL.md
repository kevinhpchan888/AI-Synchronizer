---
name: voicebox
description: Use when the user wants to clone a voice, generate TTS that matches someone's accent or speaking style, synthesize speech from a reference audio sample, or drive the local Voicebox app (jamiepine/voicebox) installed on this PC. Triggers include phrases like "clone this voice", "make it sound like", "preserve accent", "TTS in their style".
---

# Voicebox — Voice Cloning with Accent & Style Preservation

Local Voicebox app (https://github.com/jamiepine/voicebox) running on AMVPC at `http://127.0.0.1:17493`. OpenAPI spec lives at `C:\Users\Kevin Chan\Downloads\voicebox\vb_openapi.json`. DB at `%AppData%\sh.voicebox.app\voicebox.db`.

## Core Principle

**Voice ≠ accent ≠ style.** Cloning timbre is the easy part — most TTS engines do it. Preserving *accent* and *speaking style* requires (1) the right engine, (2) clean reference audio with an accurate transcript, and (3) explicit `instruct` steering at generation time. Skip any of the three and the output will sound like the speaker reading in a generic American TTS voice.

## Prerequisites Check

```bash
curl -s http://127.0.0.1:17493/health
```

If the server isn't responding, the **Voicebox desktop app is closed** — launch `C:\Program Files\Voicebox\voicebox.exe` first. The HTTP server is a child of the GUI; closing the app kills the server and aborts any in-flight downloads.

If `gpu_available: false`, trigger CUDA download with `POST /backend/download-cuda` (one-time, ~1GB). Trigger model downloads with `POST /models/download {"model_name":"chatterbox-tts"}`. Both can be done via the GUI Settings instead.

## Engine Selection (THIS DETERMINES ACCENT FIDELITY)

| Engine | Clones voice? | Preserves accent? | Style steering | Notes |
|---|---|---|---|---|
| `chatterbox` / `chatterbox_turbo` | ✅ | ⚠️ partial — pulls toward American English even with non-American refs | emotion/energy via `instruct`, accent steering is weak | Best timbre clone available; accent must be reinforced via multiple Singlish-heavy reference samples |
| `luxtts` | ✅ | ⚠️ partial | minimal | Worth A/B vs chatterbox |
| `tada` | ✅ | weak | minimal | Lightweight, skip for accent work |
| `qwen` | ❌ (preset voices) | n/a | rich `instruct` | Use only when no reference audio |
| `qwen_custom_voice` | ❌ (designed/preset only) | n/a | rich `design_prompt` (2000 chars) | Server rejects `voice_type=cloned` with this engine. For voice DESIGN from a text description, not cloning |
| `kokoro` | ❌ presets only | — | — | Don't use for cloning |

**For cloning: `chatterbox` is the only first-class option.** No engine in this stack does true accent-preserving clone of Asian-English variants — chatterbox's training data leans American. Mitigate by uploading multiple Singlish-heavy reference samples (natural conversation, not stagey performance) and explicit "do not sound American" in `instruct`. Don't expect miracles on the accent dimension.

## Workflow

```
1. Create profile (voice_type=cloned)
2. POST sample → audio file + EXACT transcript
3. (optional) POST more samples → varied prosody
4. POST /generate with profile_id + instruct
5. Iterate on instruct + seed; lock seed once you like a take
```

### Reference Audio Rules

- **Clean**: no music, no SFX, no overlapping speakers, no heavy reverb. Run through a denoiser if needed.
- **Length**: chatterbox caps each sample at **30s max** — server returns `400 "Audio too long (maximum 30.0 seconds)"`. Chunk longer source audio with `ffmpeg -t 28 -c copy` and upload multiple samples to the same profile.
- **Variety**: include questions, statements, emphasis, and emotion if you want range. Single-mood reference → single-mood clones.
- **Transcript MUST match the audio verbatim**, including filler words. Bad transcripts produce bad clones — this is the most common failure mode. Use `/transcribe` if you don't have one. Re-transcribe each chunk after splitting; never reuse a transcript from a longer source.
- **Filename apostrophes break multipart uploads** in some clients (curl on Windows specifically). Copy to a clean filename first.

### The `instruct` Field (max 500 chars) — where style lives

`instruct` is the per-generation style knob. The reference audio gives timbre + baseline accent; `instruct` locks register, mood, pacing.

Good instruct examples:
- `"Speak with a Singaporean (Singlish) accent, warm and slightly playful, like an auntie sharing exciting news. Conversational pacing, occasional rising intonation on key words."`
- `"British RP accent, dry and authoritative, slow measured pacing, like a documentary narrator."`

Bad instruct examples:
- `"sound natural"` — too vague, engine ignores it
- `"speak like Koh Chieng Mun"` — engine has no idea who that is

## End-to-End Example (PowerShell-friendly bash)

Adapt paths/text. This is the canonical pattern.

```bash
VB=http://127.0.0.1:17493
AUDIO="/c/Users/Kevin Chan/YT Saver/Download/sample.mp3"
TRANSCRIPT="exact verbatim transcript of the audio above..."

# 1. Create profile
PID=$(curl -s -X POST $VB/profiles -H 'Content-Type: application/json' \
  -d '{"name":"KohChiengMun","language":"en","voice_type":"cloned","default_engine":"chatterbox"}' \
  | python -c "import sys,json;print(json.load(sys.stdin)['id'])")

# 2. Add reference sample (audio + transcript)
curl -s -X POST "$VB/profiles/$PID/samples" \
  -F "file=@$AUDIO" \
  -F "reference_text=$TRANSCRIPT"

# 3. Generate with style steering
curl -s -X POST $VB/generate -H 'Content-Type: application/json' -d @- <<JSON
{
  "profile_id": "$PID",
  "text": "Hello everyone, I have very exciting news for all of you.",
  "engine": "chatterbox",
  "language": "en",
  "instruct": "Singaporean (Singlish) accent, warm and playful auntie tone, conversational pacing, slight rising intonation on emphasized words.",
  "seed": 42,
  "normalize": true
}
JSON

# 4. Fetch audio (id from generate response)
curl -s "$VB/audio/$GEN_ID" -o out.wav
```

## Iteration Loop (how good clones get made)

1. Generate 3–5 takes with **different seeds**, same instruct.
2. If all takes have the same flaw (wrong accent intensity, wrong mood) → fix `instruct`, not seed.
3. If takes vary wildly → add another reference sample with the missing prosody.
4. If timbre is off → reference audio is the problem (noise, too short, bad transcript).
5. Lock the winning seed for production.

## Common Failures

| Symptom | Root cause | Fix |
|---|---|---|
| Output sounds American despite Singaporean reference | Wrong engine (`luxtts`, `kokoro`, `qwen`) | Switch to `chatterbox` or `qwen_custom_voice` |
| Clone has right accent, wrong energy | `instruct` too vague or empty | Write specific mood + pacing instruct |
| Robotic / glitchy output | CPU backend, or model not warmed | Install CUDA, retry; preload model via `/models/load` |
| Each generation sounds different | No seed | Set `seed` to fixed integer |
| Cloning fails entirely | `reference_text` doesn't match audio | Re-transcribe with `POST /transcribe` |
| Long text chunks drift | `max_chunk_chars` too high | Lower to 400; raise `crossfade_ms` to 100 |

## Quick Reference

- Health: `GET /health`
- List engines' presets: `GET /profiles/presets/{engine}`
- Profiles: `GET/POST /profiles`, `POST /profiles/{id}/samples`
- Generate: `POST /generate` (returns generation_id)
- Audio: `GET /audio/{generation_id}`
- Transcribe a clip: `POST /transcribe`
- Available engines: `qwen | qwen_custom_voice | chatterbox | chatterbox_turbo | luxtts | kokoro | tada`

For full schemas read `C:\Users\Kevin Chan\Downloads\voicebox\vb_openapi.json` (filter to the path you need — the spec is 31k tokens).
