---
name: apc-video
description: APC Article Video pipeline. Turns Aging Parent Care blog articles into 60-second vertical Reels using Remotion (React-based video framework). Covers script writing, photorealistic image prompts (NanoBanana Pro), stock footage sourcing, ElevenLabs Cassidy voiceover, Remotion composition building, and final render. Use this skill whenever creating APC video scripts, generating photorealistic image prompts for video Ken Burns stills, building Remotion compositions, discussing the video pipeline, or producing any APC Reel or YouTube Short. Also trigger when the user mentions "second video," "next video," "video script," "Remotion," "Ken Burns stills," "VO clips," or "NanoBanana Pro prompts for video." This is NOT the same as apc-illustrations (Tomi Um watercolors for blog articles). This skill is for photorealistic video production only.
---

# APC Article Video Pipeline

Turn APC blog articles into 60-second vertical Reels with cinematic photorealistic visuals, per-line voiceover, and a reusable Remotion component library.

## Format Specs

| Property | Value |
|----------|-------|
| Resolution | 1080x1920 (9:16 vertical) |
| Duration | 60 seconds |
| Frame rate | 30fps |
| Total frames | 1800 |
| Framework | Remotion (React) |
| Project path | `C:\Users\Kevin Chan\apc-video-engine\` |
| Output path | `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\CAMPAIGN\Article Videos\` |

## Emotional Arc Template

Every video follows this eight-beat structure. The arc moves from crisis to hope to action. Don't skip beats or reorder them; the pacing is tested and the CTA lands because the emotional groundwork precedes it.

| Beat | Time | Duration | Purpose | Component |
|------|------|----------|---------|-----------|
| 1. Hook | 0-4s | ~3.8s | Crisis opening. One gut-punch line that stops the scroll. | Caption (scale: true) |
| 2. Escalation | 4-9s | ~5.4s | Daily reality stacking. Short staccato VO lines. | Caption |
| 3. Cascade | 9-18s | ~9.3s | Three questions/details waterfall in, then fade to punchline. | CascadeText |
| 4. Emotional Pivot | 18-27s | ~9.0s | "Nobody trains/warns you" moment. Weight, guilt, silence. | Caption (scale on key line) |
| 5. Stat Card | 27-33s | ~5.5s | Single powerful statistic. Data validates the feeling. | StatCard |
| 6. Hope/Solution | 33-43s | ~6.5s + 3.5s | Turn toward agency. One concrete action. Key phrase gets kinetic treatment. | Caption + KineticText |
| 7. "Not Alone" | 43-46s | ~3.2s | Dark background, single reassurance line. Breathing room before CTA. | Caption (center, 64px, scale) |
| 8. CTA | 46-60s | ~13.8s | Starter Kit card. Identical across all videos. | CTACard |

### Beat-by-beat writing notes

**Hook**: Open with a sensory detail or a moment the viewer recognizes from their own life. Not a question, not a statistic. A scene. "Your alarm goes off. You're already tired." "The call comes at 2 A.M."

**Escalation**: Two or three short lines that stack consequences. Each line is its own VO clip. Pacing matters more than word count.

**Cascade**: Three short labels (one concept each) that appear one at a time via CascadeText, then all fade and a punchline + punchline2 replace them. The punchline should land like a verdict. "You don't know." "You don't register any of this as a problem."

**Emotional Pivot**: The longest scene. This is where the viewer feels seen. Ground it in specific behavior (canceling appointments, eating standing up) rather than abstract emotion.

**Stat Card**: One number, one sentence. The stat should feel like proof of what the viewer just experienced emotionally. Source it from the article's cited research.

**Hope/Solution**: Pivot from weight to agency. Not "practice self-care" (too vague). One specific, achievable action. The KineticText phrase is 2-3 words max: "Just tomorrow." "Tell one person."

**"Not Alone"**: Near-identical structure every video. Dark bg (#0a0a0a), single line, large centered text. Vary the wording slightly per video but keep the same emotional register.

**CTA**: CTACard component, unchanged across all videos. VO lines are always three: (1) "I made a free..." (2) "Twenty-two pages..." (3) "Comment PARENT below..."

## Visual Style

This pipeline uses **photorealistic** visuals. It has nothing to do with the Tomi Um watercolor illustrations used in APC blog articles.

### Stock Video
- Cinematic, documentary feel
- Muted warm tones, natural lighting
- Shallow depth of field preferred
- Sources: Artlist, Pexels, or AI-generated (Seedance, Veo)

### AI-Generated Stills (Ken Burns)
- Photorealistic, cinematic
- Shot on full-frame camera look (50mm, f/2.0, shallow DOF)
- Warm natural light: golden hour, window light, lamplight, range hood glow
- Muted warm color grade, slightly desaturated
- Generated in NanoBanana Pro at 16:9 (2400x1350), 4x quality
- These images get Ken Burns panned inside the 9:16 vertical frame

### Human Figures
- No distinct faces, ever
- Show from behind, hands-only, three-quarter turned away, or cropped at shoulders
- Silhouettes work for emotional moments

### Environmental Storytelling
Objects carry the emotional weight: pill bottles, cold coffee, unopened mail, phone on nightstand, weekly pill organizer, crumpled to-do list, fitness tracker face-down. The scene tells the story before the caption does.

## AI Image Prompt Template

Use this template for every NanoBanana Pro still. Replace bracketed sections.

### Prompt format:
```
Cinematic photorealistic photograph. [SCENE DESCRIPTION with specific objects, positioning, and human figure direction]. Shot on full-frame camera with 50mm lens, shallow depth of field, f/2.0. [LIGHTING: e.g., "Warm golden hour light from a window to the left" or "Single range hood light, rest of kitchen dark"]. Muted warm color grade, slightly desaturated. No text, no watermark, no logos. No distinct facial features visible.
```

### Negative prompt (always the same):
```
no text, no watermark, no logos, no lettering, no writing, no words, no cartoon, no illustration, no painting, no 3D render, no anime, no oversaturated colors, no distinct facial features, no direct eye contact with camera
```

### Settings: NanoBanana Pro, 16:9 (2400x1350), 4x quality

### Delivery format for image prompts

Each image prompt must be delivered with isolated copy-ready blocks:

1. Brief scene description (plain text, NOT in a code block)

2. **Filename** (its own code block):
```
apc-burnout-03-woman-sink-night_pp.png
```

3. **Prompt** (its own code block):
```
Cinematic photorealistic photograph. [full prompt here]
```

4. **Negative prompt** (its own code block):
```
no text, no watermark, no logos, no lettering, no writing, no words, no cartoon, no illustration, no painting, no 3D render, no anime, no oversaturated colors, no distinct facial features, no direct eye contact with camera
```

5. **Settings** (plain text): NanoBanana Pro, 16:9, 4x quality

## Naming Conventions

| Asset | Pattern | Example |
|-------|---------|---------|
| Composition | `src/{PascalCaseSlug}.tsx` | `TheBurnoutNobodyTalksAbout.tsx` |
| Stock video | `public/apc-{slug}-V{##}-{desc}.mp4` | `apc-burnout-V01-alarm-clock.mp4` |
| AI still | `public/apc-{slug}-{##}-{desc}_pp.png` | `apc-burnout-03-woman-sink-night_pp.png` |
| VO clip | `public/vo/{##}-{desc}.mp3` | `01-your-alarm-goes-off.mp3` |
| Music | `public/bg-music-{slug}.mp3` | `bg-music-burnout.mp3` |

The `_pp` suffix on stills stands for post-processed. Keep it for consistency with Video 1 assets.

## Voiceover

- **Voice**: ElevenLabs Cassidy. No exceptions. Never use synthetic TTS (edge-tts, etc.) for production.
- **Architecture**: Per-line clips. One MP3 per VO line, not a monolithic narration track.
- **Reason**: Per-line clips let visuals drive pacing. Each scene's Audio elements are independent, so you can shift a scene's timing without re-recording.
- **Numbering**: Sequential from 01. Typically 17-19 clips for a 60s video.
- **Recording**: Generate via ElevenLabs API or studio. Cassidy voice ID is in the ElevenLabs account.

## Music

- Emotional ambient bed, instrumental only
- Kevin selects the track manually (don't auto-pick)
- Volume: 30% base level via frame-based callback:
```tsx
const musicVolume = (frame: number) => {
  const base = 0.30;
  const fadeOutStart = f(57);
  const fadeOutEnd = f(60);
  if (frame >= fadeOutEnd) return 0;
  if (frame >= fadeOutStart) {
    return base * interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0]);
  }
  return base;
};
```
- Music track must be longer than 60s to avoid cutoff

## Remotion Component Library

All components live in `src/components/` and are reused across videos:

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Caption.tsx` | Text overlay with fade in/out | `text, startFrame, endFrame, fontSize, scale, position` |
| `CascadeText.tsx` | Waterfall text lines that build, then fade to punchline | `lines[], punchline, punchline2, allFadeFrame, punchlineFrame` |
| `StatCard.tsx` | Large animated stat number + description | `stat, description, fps` |
| `KineticText.tsx` | Word-by-word spring reveal | `words[], startFrame, fps, fontSize, color, position` |
| `KenBurns.tsx` | Slow zoom/pan on still images | `src, durationFrames, zoomStart, zoomEnd, panX` |
| `Crossfade.tsx` | Fade transitions between scenes | `durationFrames, fadeIn, fadeOut` |
| `CTACard.tsx` | End card with Starter Kit | `fps` |

### CTACard content (locked, identical across all videos)
- Starter Kit cover: `starter-kit-cover.png`
- "FREE" badge (red, rotated)
- Bullets: "22 pages & 6 printable templates", "Your first 30 days covered", "Medical, legal, financial, family", "The sibling conversation script"
- Middle zone: "+ FREE ACCESS TO Aging Parent Caregiving Resource Library"
- Bottom: "Comment PARENT below" with bouncing arrow emoji
- Pulse animation on CTA text after 8 seconds (frame 240)

## Script Format

Scripts are delivered as screenplay-format documents:

```
═══════════════════════════════════════════════════════════
  APC VIDEO #N -- "TITLE"
  Format: 1080x1920 (9:16) | 60s | 30fps | 1800 frames
  Voice: ElevenLabs Cassidy
  Music: TBD
═══════════════════════════════════════════════════════════

━━━ SCENE 1: LABEL (0.0s - 3.8s) ━━━━━━━━━━━━━━━━━━━━━━━

VISUAL:  [Stock footage or AI image description]

VO-01:   "Exact text for Cassidy."

CAPTION: Text that appears on screen.

NOTES:   [Component to use, animation notes]
```

End every script with:
1. **VO Line Summary** (all numbered lines in order)
2. **Shot List** (stock video + AI images needed)
3. **Component Reuse** (checklist of which components from the library)

## Production Workflow

1. **Select article** from Notion. Prioritize: strong stat hook, high emotional resonance, universal caregiver experience, commentable angle.
2. **Write script** following the emotional arc template. Deliver in screenplay format.
3. **Kevin approves** script (human-in-the-loop gate).
4. **Generate AI image prompts** (photorealistic, NanoBanana Pro, copy-ready blocks).
5. **Source stock video** from Artlist, Pexels, or generate via AI (Seedance/Veo).
6. **Record VO** with ElevenLabs Cassidy, per-line clips.
7. **Kevin selects music** (human-in-the-loop gate).
8. **Build Remotion composition** in `src/`, register in `Root.tsx`.
9. **Kevin reviews** in Remotion Studio, provides feedback.
10. **Polish and render** final MP4 to output folder.

## Completed Videos

| # | Title | Slug | Article | Status |
|---|-------|------|---------|--------|
| 1 | Your Parent Fell. Now What? | parent-fell | BA-?? | FINAL (v21) |
| 2 | The Burnout Nobody Talks About | burnout | BA-61 | Script drafted |
