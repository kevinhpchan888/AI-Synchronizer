# The Google Flu Trends Autopsy

**Author:** Donny (Kevin Chan)
**Source paper:** Lazer, Kennedy, King & Vespignani, *Science* 343:1203 (14 March 2014), "The Parable of Google Flu: Traps in Big Data Analysis"

This is required reading for anyone using Google Trends as a leading indicator
of anything. The story is the canonical caution about big-data hubris in the
attention-data domain.

---

## Timeline

| Date | Event |
|---|---|
| Nov 11, 2008 | GFT launches with publication in *Nature* (Ginsberg et al., 457:1012) |
| Apr-Jun 2009 | GFT misses the H1N1 spring pandemic outright |
| 2009-2012 | Hype peak; GFT expands to ~29 countries; treated as proof of "big data > traditional surveillance" |
| Feb 13, 2013 | *Nature* news (Butler) reports GFT overshot CDC by ~140% in 2012-2013 season, peaking ~6.04 percentage points above CDC |
| Mar 14, 2014 | Lazer-Kennedy-King-Vespignani publish in *Science*: GFT overshot CDC in **100 of 108 weeks** from August 2011 onward; out-of-sample MAE 0.486 for GFT alone vs **0.311** for lagged CDC alone vs 0.232 for GFT+CDC combined |
| Aug 9, 2015 | Google retires the public GFT tool |
| 2022 | Katsikopoulos et al. (*Int. J. Forecasting*) shows simple "next week = this week" recency heuristic beat GFT over the full 2007-2015 window (MAE 0.20 vs 0.38) |

The clinching humiliation: a recency-naive baseline that would have taken thirty
seconds to implement beat seven years of Google engineering work.

---

## The Four Pillars of Failure

### 1. Big-data hubris

The original GFT design treated 50 million candidate queries as if more data
automatically beats traditional CDC influenza-like illness surveillance.
**Big data is a supplement, not a substitute, for measurement infrastructure
designed by domain experts.** The CDC's surveillance network exists to be
calibrated. GFT existed to find correlations.

### 2. Algorithm dynamics

This is the cruelest pillar. **Google's own product changes endogenously
altered the input distribution that GFT depended on.**

- 2008+ : autosuggest expansion changed what users typed
- June 2011: related-searches sidebar changed which queries appeared
- February 2012: health-search redesign nudged users toward symptom-checker workflows

GFT's training data assumed a stationary relationship between user intent and
typed query. Google made that relationship non-stationary by shipping product
features. Every Trends-driven model lives under this Damocles sword.

### 3. Overfitting

GFT selected **45 of 50 million** candidate terms against approximately 1,150
weekly observations of ground truth. By any standard test the multiple-comparisons
problem makes this a guaranteed-overfit setup. Some of the selected terms had no
medical relevance — "high school basketball" became a flu-season proxy because
flu season correlates with basketball season, not because basketball causes flu.

### 4. Lack of model maintenance and transparency

GFT was retrained annually with undisclosed changes. The exact term list was
never published. Replication was nearly impossible. Without transparency the
academic community could not detect the degradation between 2011 and 2013 in time
to push back before public-health agencies considered relying on it.

---

## Operational Lessons For This Skill

Every Trends-driven analysis Claude produces should pass these tests:

1. **Is the model a supplement or substitute?** If the answer is "substitute," refuse.
2. **Is the algorithm-dynamics risk acknowledged?** Explicitly note that Google product changes can break the model.
3. **Is the term selection transparent and small?** OECD's Weekly Tracker uses 215 *categories*, not selected keywords, specifically to avoid the GFT overfitting trap.
4. **Are baselines included?** Always benchmark against seasonal-naive AND recency-naive. If a recency-naive baseline beats your fancy model, throw away the fancy model.
5. **Is the persistence assumption tested?** Re-validate the model annually on out-of-sample data.

---

## The Single Most Important Sentence

From Lazer et al., paraphrased: *"All empirical research stands on a foundation
of measurement. Quantity of data does not mean that one can ignore foundational
issues of measurement and construct validity."*

Google Trends measures **share of sampled Google searches under a particular
algorithmic regime at a particular point in time**. It does not measure interest,
intent, or behavior in any general sense. Treat it accordingly.
