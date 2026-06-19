# Platform Matrix

All platforms the user has access to, with strengths, limitations, and when to use each.

---

## Video Generation Platforms

### Seedance 2.0 (via MuaPi API)
- **Access**: API via MuaPi platform (media upload + prompt submission)
- **Duration**: 4–8 seconds per clip
- **Resolution**: 720p (720x1280 vertical, 1280x720 landscape)
- **Audio**: No native audio — generates silent video
- **Character consistency**: Strong — uses reference image anchoring
- **Prompt style**: Detailed, timestamped `[0:00-0:04]`, 2500-3000 characters
- **Best for**: High-quality character-consistent clips, reference-image-based generation, batch pipeline automation
- **Limitations**: No speech, no audio, 8s max, needs post-process lip sync (sync-3), costs per clip
- **Pipeline**: MuaPi submit → poll → download → fal.ai sync-3 → ffmpeg concat
- **See**: `seedance-rules.md` for detailed prompt rules

### Gemini Omni / Flash (Google AI Pro)
- **Access**: Gemini app (gemini.google.com), free with AI Pro subscription
- **Duration**: Up to 10 seconds
- **Resolution**: 720x1280 (vertical)
- **Audio**: Native speech generation + lip sync in one pass
- **Character consistency**: Moderate — reference image helps but less precise than Seedance
- **Prompt style**: Natural language, dialogue embedded in quotes, plain English emotional direction
- **Best for**: Quick turnaround, speech-integrated clips, prototyping, free generation
- **Limitations**: 10s cap, no voice cloning (uses its own voice), less control over exact facial micro-expressions, manual (no API batch)
- **Pipeline**: Paste prompt + upload reference image → download result

### Higgsfield (Pro Ultra account)
- **Access**: App / web interface, Pro Ultra subscription
- **Duration**: Up to 16 seconds per clip
- **Audio**: Varies by mode
- **Character consistency**: Good — supports character creation
- **Prompt style**: Cinematic, concise, strong motion understanding
- **Best for**: Longer single clips (up to 16s = fewer clips needed), high visual quality, strong motion/physics
- **Limitations**: Manual workflow (no API), learning curve on character system
- **Pipeline**: Manual generation → download → optional sync-3 if needed

### Artlist Studio (Pro account)
- **Access**: Web interface, Pro subscription
- **Duration**: Varies
- **Character creation**: Yes — dedicated character builder with personality + appearance
- **Scene direction**: Structured — choose background, camera frame, then describe action
- **Prompt style**: Structured fields (character, background, camera frame, scene action) rather than free-form
- **Best for**: Projects needing a persistent character across many videos, structured directing workflow
- **Limitations**: More constrained than free-form prompting, platform-specific workflow
- **Pipeline**: Create character → choose scene settings → describe action → generate

### Veo 2 / Veo 3.1 (Google, via API if available)
- **Access**: Via Google AI API (google-genai SDK)
- **Duration**: 4–8 seconds
- **Audio**: Veo 3.1 has full audio (dialogue, SFX, ambient)
- **Multi-shot**: Native timestamp format support
- **Best for**: API-automated generation with audio, timestamp-structured sequences
- **Limitations**: API access may require separate key, generation costs

---

## Post-Production Tools

### fal.ai sync-3 (API)
- **What it does**: Lip sync — takes a video + audio, replaces mouth animation to match speech
- **Access**: API via FAL_KEY
- **Key constraint**: Output capped at video length — if audio is longer than video, audio gets truncated
- **Best for**: Adding speech to silent Seedance/Higgsfield clips
- **Not needed for**: Gemini Omni (has native speech), Veo 3.1 (has native audio)
- **Pipeline note**: Submit endpoint uses `/v3`, polling endpoint does NOT

### ElevenLabs (API)
- **What it does**: Text-to-speech with voice cloning
- **Access**: API via ELEVENLABS_API_KEY
- **Voices**: Cassidy (custom clone, voice ID: 56AoDkrOh6qfVPDXZ7Pt)
- **Best for**: When you need a specific cloned voice (not generic TTS)
- **Pipeline**: Generate TTS → split at silence points → pair with video clips → sync-3

### ffmpeg (local)
- **What it does**: Video concatenation, crossfade transitions, format conversion
- **Key settings**: `-pix_fmt yuv420p` (always), `-crf 18 -preset slow`, `xfade` filter for crossfades
- **Known issue**: xfade filter promotes to yuv444p — always force yuv420p in output

---

## Platform Selection Decision Tree

```
PROJECT TYPE: UGC talking-head reel (60s)
├── Need specific cloned voice?
│   ├── YES → ElevenLabs TTS → Seedance (MuaPi) → sync-3 → ffmpeg
│   └── NO → Voice quality matters less?
│       ├── Quick/free → Gemini Omni (6 × 10s clips, manual)
│       └── Highest quality → Seedance + sync-3 pipeline
│
PROJECT TYPE: Single hero clip (8-16s)
├── Needs speech? → Gemini Omni or Veo 3.1
├── Needs character consistency with other clips? → Seedance (reference image)
├── Needs longest possible single clip? → Higgsfield (16s)
└── Needs structured character + directing? → Artlist Studio
│
PROJECT TYPE: Product/brand video
├── Stylized/cinematic? → Higgsfield or Seedance
├── Quick prototype? → Gemini Omni
└── Persistent brand character? → Artlist Studio
│
PROJECT TYPE: Batch production (many videos)
└── API automation required → Seedance (MuaPi) + sync-3 pipeline
```

---

## Cost Comparison

| Platform | Cost per clip | Batch? | Notes |
|----------|--------------|--------|-------|
| Seedance (MuaPi) | ~$2-3 | Yes (API) | Plus sync-3 costs |
| Gemini Omni | Free (with AI Pro) | No (manual) | Included in subscription |
| Higgsfield | Included (Pro Ultra) | No (manual) | Subscription-based |
| Artlist Studio | Included (Pro) | No (manual) | Subscription-based |
| fal.ai sync-3 | ~$0.50-1 per clip | Yes (API) | Post-production only |
| ElevenLabs | Per character | Yes (API) | TTS only |
