# EPUB Accessibility 1.1 checklist (W3C REC, 17 Oct 2024)

## MUST
- `schema:accessMode` (one or more: textual, visual, auditory, tactile)
- `schema:accessibilityFeature` (e.g. alternativeText, tableOfContents, readingOrder)
- `schema:accessibilityHazard` (none, flashing, motionSimulation, sound, etc.)

## MUST when claiming conformance
- `dcterms:conformsTo` value: `EPUB Accessibility 1.1 - WCAG 2.x Level [A|AA|AAA]`
- `a11y:certifiedBy` refines the conforms-to id

## SHOULD
- `schema:accessibilitySummary`
- `schema:accessModeSufficient`

## Common errors EPUBCheck 5.3.0 flags
- OPF-014 missing `dcterms:modified`
- RSC-005 stylesheet not declared in manifest
- HTM-009 missing alt on img
