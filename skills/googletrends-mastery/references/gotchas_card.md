# The Twelve Gotchas — Printable Card

**Author:** Donny (Kevin Chan)
**Pin this above your monitor.**

---

1. **0–100 is RELATIVE.** Window, geo, term-set. Add a term, everything rebases.
2. **Zero ≠ Zero.** It means below threshold. Use Wikipedia to verify.
3. **Sampling is RANDOM.** Same query, different numbers each pull. Average ≥4.
4. **5 groups × 25 OR-terms MAX.** Beyond that, anchor-batch and rebase offline.
5. **Real-time and non-real-time are DIFFERENT POOLS.** Never splice.
6. **Granularity is FORCED.** Hourly ≤7d, daily ≤270d, weekly ≤5y, monthly all-time. Daily aggregated to monthly ≠ directly-pulled monthly.
7. **Operators:** `+` is OR. `"quoted"` is exact. `-token` excludes (no space). Parentheses unsupported.
8. **Topic ≠ Search Term.** Topic is a Knowledge Graph entity; Search Term is literal. Never mix.
9. **Categories restrict NUMERATOR AND DENOMINATOR.** Document category in note.
10. **AI Mode + AI Overviews queries EXCLUDED.** AI topics undercounted post-2024.
11. **Algorithm dynamics endogenously change input.** Re-validate persistent models annually.
12. **Geo-IP biases urban; Google share <50% in CN/KR/RU.** Use Wikipedia for multilingual triangulation.

---

## The Three Reflexes

- **Direction over magnitude.**
- **Triangulate or shut up.**
- **Replicate or refuse to quote.**
