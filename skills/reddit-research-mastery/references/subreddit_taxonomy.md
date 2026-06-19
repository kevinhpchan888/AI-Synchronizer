# Subreddit Taxonomy for VOC Mining

The map of where customers actually hang out, by intent.

## Pain-rich generalist subs (start here for unfiltered VOC)
- `r/AskReddit` — broad, but threads on a category give the cleanest unfiltered language
- `r/AskWomen`, `r/AskMen`, `r/AskOldPeople`, `r/AskWomenOver30` — demographic VOC
- `r/Adulting` — life-stage pain (great for home/wellness/finance products)
- `r/socialskills`, `r/relationships`, `r/relationship_advice` — emotional pain language
- `r/CasualConversation` — low-stakes, honest
- `r/TrueOffMyChest`, `r/offmychest` — venting, raw frustrations
- `r/Vent`, `r/rant` — unfiltered

## Buying-decision subs
- `r/BuyItForLife` — quality-driven buyers, anti-disposable framing
- `r/whatisthisthing` — product identification (find what people are searching for blindly)
- `r/HelpMeFind`, `r/findfashion`, `r/findagift` — explicit JTBD requests
- `r/whatisthisbug`, `r/whatsthisplant` — problem framing (these are NOT just nature subs; people post photos of pests/weeds with "what is this and how do I get rid of it")
- `r/Frugal`, `r/povertyfinance` — price-sensitive segment language
- `r/Anticonsumption` — anti-purchase critics; useful for understanding objection language

## Skeptic / scam-watch subs
- `r/scams` — your product will end up here if your funnel looks shady; check weekly
- `r/Anticonsumption` — anti-dropshipping sentiment, useful for defensive copy
- `r/dropship`, `r/Flipping`, `r/EntrepreneurRideAlong` — competitors discussing your product
- `r/AmazonSeller`, `r/FulfillmentByAmazon` — Amazon ecosystem competitor talk
- `r/InstacartShoppers`, `r/UberEATS` — gig economy customer mindset

## Demographic / lifestyle subs (find the cohort)
- `r/Tall`, `r/petite`, `r/PlusSize`, `r/Big_and_Tall` — body-shape niches
- `r/AsianBeauty`, `r/SkincareAddiction`, `r/MakeupAddiction` — beauty
- `r/Frugal_Jerk`, `r/FrugalFemale_Fashion` — niche cohort + behavior
- `r/HomeImprovement`, `r/DIY`, `r/Frugal_DIY` — handy crowd
- `r/parenting`, `r/Mommit`, `r/Daddit`, `r/beyondthebump`, `r/breastfeeding` — parents (massive buyer segment)
- `r/dogs`, `r/cats`, `r/pets`, `r/dogtraining`, `r/Pomeranians`, etc. — pet niches (huge spend per customer)
- `r/financialindependence`, `r/personalfinance` — wealth-conscious segments
- `r/digitalnomad`, `r/onebag`, `r/heronebag` — travel-product buyers
- `r/fitness`, `r/xxfitness`, `r/loseit`, `r/keto`, `r/intermittentfasting` — fitness/health
- `r/MealPrepSunday`, `r/EatCheapAndHealthy` — kitchen/food niche
- `r/cordcutters`, `r/buildapc`, `r/headphones`, `r/audiophile` — tech buyers
- `r/<country>` (r/AskUK, r/AskAnAustralian, r/CanadaBuyItForLife) — geo-specific buying patterns

## Problem-specific subs (per-niche maps)

### Posture / back / ergonomics
- r/posture, r/backpain, r/ergonomics, r/standingdesk, r/WFH, r/Office

### Sleep / mattress / comfort
- r/Mattress, r/Sleep, r/insomnia, r/sleephackers, r/CPAP

### Skin / beauty / hair
- r/SkincareAddiction, r/AsianBeauty, r/30PlusSkinCare, r/Rosacea, r/acne, r/HaircareScience, r/curlyhair, r/FemaleHairLoss, r/tressless

### Pets
- r/dogtraining, r/reactivedogs, r/PuppySchool, r/cats, r/cattraining, r/AskVet

### Kitchen / cooking
- r/Cooking, r/AskCulinary, r/MealPrepSunday, r/castiron, r/sousvide, r/Coffee, r/espresso

### Home / cleaning
- r/CleaningTips, r/declutter, r/organization, r/HomeImprovement, r/MaliciousCompliance (yes, surprisingly useful for home conflict products)

### Tech / accessories
- r/buildapc, r/headphones, r/MechanicalKeyboards, r/AppleWatch, r/iPhone, r/EarthPorn (?), r/gadgets

### Outdoors / car / travel
- r/CampingGear, r/Ultralight, r/cars, r/MechanicAdvice, r/onebag, r/travel, r/digitalnomad

### Mental health / focus / productivity
- r/ADHD, r/anxiety, r/getdisciplined, r/productivity, r/decidingtobebetter, r/getmotivated

## How to find the niche sub if you don't know it
1. Search `site:reddit.com "<your product or category>"` on Google, count which subs appear most
2. Look at `r/findareddit` — actual subreddit-discovery requests
3. Look at the sidebar of the obvious sub for "related communities"
4. `scripts/reddit_backend.py search "<product>" --limit 100` then count subreddit frequency in the output

## Red flag: when a sub is too marketed-to
- Mod usernames overlap with brand names
- Top posts of all time are mostly product showcases / "look at my X"
- High vendor account density in comments
- Threads like "best X 2026" with comment trees full of brand-name drops

When you find this pattern, find the **adjacent** sub where the actual user lives — usually demographic (r/AskWomen) or pain-framed (r/posture for back products) rather than product-framed (r/posturecorrectors).
