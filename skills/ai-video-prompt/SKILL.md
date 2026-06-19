---
name: ai-video-prompt
description: Generate high-quality AI prompts for image and video generation across any platform. Handles platform selection, prompt adaptation, and multi-shot sequences. Trigger on phrases like "write me a prompt", "video prompt", "image prompt", "scene breakdown", "shot list", "storyboard", or any time the user describes what they want to see and needs it translated into generation-ready instructions. Also trigger when the user describes a vibe, visual, character, or scenario for AI generation — even without saying "prompt."
---

# AI Video & Image Prompt Builder

One skill. Any platform. Three decisions to make:

```
1. WHAT TYPE?    →  Image / Single-shot video / Multi-shot sequence
2. WHICH TOOL?   →  Platform selection based on project needs
3. BUILD PROMPT  →  Adapt formula to chosen platform's strengths
```

---

## Step 1: Determine Type

| Mode | When to use |
|------|-------------|
| **IMAGE** | Still image — portraits, products, reference frames, thumbnails |
| **VIDEO (single shot)** | One continuous clip, 4–20 seconds |
| **MULTI-SHOT** | Sequence of clips for a full scene, reel, or ad |

If unclear, ask ONE question: "Image or video — and roughly how long?"

---

## Step 2: Choose Platform

Read `references/platform-matrix.md` before recommending a platform.

**Decision framework — match the project to the platform's strength:**

```
Need native speech + lip sync?        → Gemini Omni (free, 10s cap)
Need precise character consistency?    → Seedance via MuaPi (reference image anchoring)
Need highest visual quality?           → Higgsfield / Seedance
Need longest single clip?              → Higgsfield (up to 16s) or Gemini
Need API automation / batch pipeline?  → MuaPi (Seedance) + fal.ai (sync-3)
Need character creation + directing?   → Artlist Studio
Need quick turnaround, free?           → Gemini Omni
Need lip sync on existing video?       → fal.ai sync-3
Need voice cloning + TTS?              → ElevenLabs API (then sync-3)
```

If the user hasn't specified a platform, recommend based on the project. Explain the tradeoff in one sentence.

---

## Step 3: Build the Prompt

Read `references/prompt-formulas.md` for the construction rules.
Read `references/camera-language.md` for cinematography vocabulary.

### Core formula (adapt per platform):

**Image:** `[Subject + Action] + [Location] + [Composition] + [Lighting] + [Style] + [Camera/Lens] + [Color grading]`

**Video:** `[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance] + [Audio]`

**Multi-shot:** Scene Header → Shot Sequence (timestamped) → Audio Map → Director's Notes

### Key principles (all platforms):

1. **Lead with cinematography** — shot type and camera movement first. This is the strongest lever.
2. **Be physically specific** — not "moves dynamically" but "walks at a slow, steady pace, swaying gently with each step."
3. **Describe what IS there** — positive framing, not negatives (except critical exclusions like "no text on screen").
4. **Lighting sets emotion** — always specify it explicitly.
5. **Layer the atmosphere** — environment, weather, ambient sound, background activity.
6. **Micro-expressions matter** — for close-ups, describe specific facial movements: "brow softens," "slow deliberate blink," "corners of mouth lift slightly."
7. **Separate camera from subject movement** — "She walks forward" is subject. "Camera tracks laterally" is camera. Don't conflate them.

### Platform-specific adaptation:

Each platform has different prompt DNA. After choosing the platform, adapt:

- **Seedance**: Read `references/seedance-rules.md` — timestamped shots, 2500-3000 chars, micro-actions, quality constraints at end
- **Gemini Omni**: Natural language, embed dialogue in quotes, describe emotional arc in plain English, 10s cap
- **Higgsfield**: Cinematic language, strong on motion + physics, shorter prompts, up to 16s
- **Artlist Studio**: Character-first (create character separately), then direct the scene action
- **fal.ai sync-3**: Not a generation tool — post-process lip sync. Input = video + audio, output = synced video

---

## Output Rules

1. **Always copy the prompt to clipboard** via `Set-Clipboard` — never just put it in chat
2. **Also save to a .txt file** near the project as backup
3. If the request has multiple interpretations, offer 2 versions
4. For multi-shot sequences, output all 4 sections (Scene Header, Shot Sequence, Audio Map, Director's Notes)
5. When writing for Seedance, always check character count is 2500-3000

---

## UGC Mode

When generating prompts for UGC-style content (talking head, selfie-stick, direct-to-camera):

Read `references/ugc-patterns.md` for the specialized UGC formula including:
- Selfie-stick POV setup
- Lapel microphone description
- Anti-AI guardrails ("not performing," "not an advertisement")
- Emotional arc direction per time segment
- Character templates (Sarah, etc.)

---

## Quick Reference

```
User: "write me a prompt for..."           → Identify type + platform → build
User: "which tool should I use for..."      → Platform selection → recommend
User: "generate a video of..."              → Infer type + recommend platform → build
User: "scene breakdown" / "shot list"       → Multi-shot mode → build all 4 sections
User: "make it work for Seedance"           → Adapt existing prompt to Seedance rules
User: "same thing but for Gemini"           → Re-adapt to Gemini Omni format
```
