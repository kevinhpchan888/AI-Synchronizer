---
name: selldone
description: "Selldone e-commerce platform expert — manage products, blog articles, CMS pages, orders, emails, discounts, and analytics for APC (agingparent.care). This is the integration hub for all APC store operations. Use this skill whenever the user mentions Selldone, APC store, agingparent.care, blog articles, product catalog, orders, CMS pages, newsletters, discounts, coupons, or any e-commerce management task. Also trigger when the user wants to push content, upload images, manage categories, check analytics, or do any store administration."
trigger: /selldone
---

# /selldone — APC Store Integration Hub

Expert integration with Selldone e-commerce platform. Manage all aspects of the APC store (agingparent.care) programmatically through MCP tools.

## Integrated Skill System

This skill is the **hub** of a three-skill system for APC store management. Route to the right skill based on the task:

| Task | Skill | What It Knows |
|------|-------|---------------|
| **Blog articles** (create, update, sync, illustrations) | `apc-article-ops` | Three-way sync (Selldone + Articles Page + Notion), XAPI bug workaround, article HTML structure, illustration pipeline |
| **Homepage** (edit sections, swap images, update copy, push) | `apc-homepage` | 12-section map, CSS design system, push-homepage.py workflow, illustration placement |
| **Everything else** (products, orders, emails, discounts, categories, analytics) | `selldone` (this skill) | 47 MCP tools, three API layers, all CRUD operations |

**Before generating ANY content**, read `references/apc-content-rules.md` for voice/tone rules, illustration rules, banned words, and formatting constraints. These apply to all customer-facing text across the entire site.

**Before calling ANY API**, check `references/api-quirks.md` for known bugs and workarounds that will save you from data loss.

### Cross-Reference: Key Paths

| Resource | Location |
|----------|----------|
| Homepage HTML | `H:\My Drive\...\Website and Store\homepage_code.html` |
| Homepage push script | `H:\My Drive\...\Website and Store\push-homepage.py` |
| Articles page push script | `H:\My Drive\...\Website and Store\push-articles-page.py` |
| Generated images | `H:\My Drive\...\Website and Store\Images\` |
| Content rules | `references/apc-content-rules.md` (this skill) |
| API quirks | `references/api-quirks.md` (this skill) |
| Illustration prompt rules (full) | AgentDonny project memory: `illustration_prompt_rules.md` |
| Notion content engine | AgentDonny project memory: `project_notion_content_engine.md` |

## Shop Configuration

| Key | Value |
|-----|-------|
| **Shop ID** | 14492 |
| **Shop Name** | apc-nprUqKnD |
| **Handle** | @apc-nprUqKnD |
| **Domain** | https://agingparent.care |
| **Title** | APC |
| **Currencies** | SGD (primary), USD, AUD, CAD, GBP, EUR |
| **Payment** | Stripe (SGD) |
| **Login** | LinkedIn, Google, GitHub, Apple, Selldone, Email |
| **Location** | Singapore (1.3756, 103.7685) |

## Architecture — Three API Layers

Selldone exposes THREE API layers with different auth and capabilities:

### ERP API (`api.selldone.com`)
- **Auth**: Bearer ERP token
- **Path pattern**: `/shops/{shop_id}/...` (e.g. `/shops/14492/products/all-admin`)
- **Scope**: Full backoffice — products CRUD, orders, customers, categories, pages, emails, discounts, coupons, FAQs, vendors, statistics, domains, themes, transportation, gateways, permissions
- **450+ endpoints** mapped from the backoffice-sdk

### XAPI (`xapi.selldone.com`)
- **Auth**: Bearer ERP token
- **Path pattern**: `/shops/@{shop_name}/...` (e.g. `/shops/@apc-nprUqKnD/products/all`)
- **Scope**: Storefront — product info, blog articles (full CRUD), pages by name, search, exchange rates, shop info
- **Article CRUD**: `POST /article/shop-blog/edit` (create/update), `DELETE /article/shop-blog/{id}`

### Dashboard API (`selldone.com/api`)
- **Auth**: Session cookies + XSRF token (Bearer token does NOT work — returns 401)
- **Path pattern**: `/api/...` (e.g. `/api/article/shop-blog/edit`)
- **Scope**: Same as XAPI but with session-based auth. Required for some blog operations (e.g. setting categories)
- **XSRF**: Read `XSRF-TOKEN` cookie, send as `X-XSRF-TOKEN` header
- **Access**: Use Chrome extension's `javascript_tool` to execute fetch() in browser context where cookies are already present

## MCP Tools (47 total)

### Shop
- `selldone_get_shop` — Full shop info, settings, gateways, menus
- `selldone_get_exchange_rates` — Currency rates

### Products (7 tools)
- `selldone_list_products` — Public product listing (XAPI)
- `selldone_list_products_admin` — Admin listing with search, filter by type/status/vendor (ERP)
- `selldone_get_product` — Full product details with variants, images, specs (XAPI)
- `selldone_search_products` — Search by keyword
- `selldone_create_product` — Create new product (types: PHYSICAL, VIRTUAL, SERVICE, FILE, SUBSCRIPTION)
- `selldone_edit_product` — Edit product fields
- `selldone_delete_product` — Soft-delete (restorable)
- `selldone_set_product_quantity` — Set stock for product or variant

### Blog Articles (6 tools)
- `selldone_list_articles` — List with pagination and search
- `selldone_get_article` — Full article content by blog/parent ID
- `selldone_create_article` — Create with HTML body, tags, published status
- `selldone_update_article` — Update (body field required even for partial updates)
- `selldone_delete_article` — Permanent delete
- `selldone_get_article_tags` — All tags across articles

### CMS Pages (5 tools)
- `selldone_list_pages` — List all pages
- `selldone_get_page` — Get by name (XAPI) or ID (ERP)
- `selldone_create_page` — Create new page
- `selldone_update_page` — Update content/settings
- `selldone_delete_page` — Delete page

### Orders (4 tools)
- `selldone_list_orders` — List by type (PHYSICAL/VIRTUAL/SERVICE/FILE/SUBSCRIPTION), filter by status
- `selldone_update_order_status` — Progress: OrderConfirm → PreparingOrder → SentOrder → ToCustomer
- `selldone_set_order_tracking` — Set tracking code/URL
- `selldone_order_delivery_returned` — Mark delivery returned

### Categories (5 tools)
- `selldone_list_categories` — List with search
- `selldone_create_category` — Create with optional parent
- `selldone_edit_category` — Edit fields
- `selldone_delete_category` — Delete
- `selldone_get_categories_hierarchy` — Full tree structure

### Email Campaigns (4 tools)
- `selldone_list_emails` — List campaigns
- `selldone_create_email` — Create campaign with structure
- `selldone_get_email` — Get campaign details
- `selldone_send_email` — Send/trigger campaign

### Discount Codes (4 tools)
- `selldone_list_discount_codes` — List all
- `selldone_create_discount_code` — Create (PERCENT or AMOUNT type)
- `selldone_edit_discount_code` — Edit
- `selldone_delete_discount_code` — Delete

### Coupons (3 tools)
- `selldone_list_coupons` — List all
- `selldone_create_coupon` — Create coupon

### Other
- `selldone_list_faqs` — List FAQs
- `selldone_get_statistics` — Analytics (sessions, timeline, country)
- `selldone_list_contacts` — Support/contact messages
- `selldone_list_vendors` — Vendor list
- `selldone_list_customers` — Customer list with search

### Raw API Escape Hatches
- `selldone_erp_request` — Hit ANY ERP endpoint (api.selldone.com)
- `selldone_xapi_request` — Hit ANY XAPI endpoint (xapi.selldone.com)

## Page Builder Content Model

Selldone pages use a recursive JSON component tree:

```json
{
  "title": "Page Title",
  "sections": [
    {
      "uid": "unique-id",
      "label": "Section Label",
      "object": {
        "component": "SectionType",
        "background": { "bg_color": "#fff" },
        "style": {},
        "classes": [],
        "data": { "columns": [] },
        "children": [],
        "props": {}
      }
    }
  ],
  "style": {}
}
```

### 24 Section Types
Hero1, Gallery1, Gallery2, SectionSlideShow, Social3, Social4, Newsletter, image-text-cards, infinite-stream, three-columns, text-marquee, SectionBlogList, SectionStoreListing, SectionStoreCustomersList, parallax, swiper, tabs, accordion, SectionForm, SectionMap, SectionTimeline, SectionPricing, SectionTestimonials, SectionFAQ

### 31 X-Component Building Blocks
XText, XImage, XVideo, XButton, XRow, XColumn, XContainer, XSection, XIcon, XAlert, XCountdown, XSwiper, XMarquee, XGallery, XLottie, XProductOverview, XProduct, XCollection, XBlog, XForm, XMap, XNewsletter, XRating, XUploader, XCode, XSearch, XMenu, XCustomProductsList, XVariants, XFeeder, XInput

## Article CRUD Gotchas

1. **Create**: `POST /article/shop-blog/edit` with `{ title, body, shop_id, published, private }`
2. **Update**: Same endpoint with `id` field added. **body is REQUIRED even for updates** — pass full content
3. **Delete**: `DELETE /article/shop-blog/{article_id}`
4. **List**: `GET /shops/@{name}/blogs` returns articles with `parent_id` field
5. **Get single**: `GET /shops/@{name}/blogs/{parent_id}` (use parent_id, NOT article id)

### ⚠️ CRITICAL: Article Edit Payload Rules

**Full save payload** (from `ArticleViewer.BuA5N9LZ.js`):
```json
{
  "type": "Blog",
  "article_id": 719591,
  "slug": "...",
  "page_title": "...",
  "title": "...",
  "body": "<p>full HTML content</p>",
  "image": "image-url-or-null",
  "description": "...",
  "published": true,
  "private": false,
  "lang": "en",
  "multi_language": false,
  "product_id": null,
  "parent_id": null,
  "shop_id": 14492,
  "category": 7926,
  "schedule_at": null,
  "order": 0,
  "star": false,
  "faqs": [],
  "structures": [],
  "cluster_id": null
}
```

**Key rules:**
- **Category field is `category`** (NOT `category_id`). Using `category_id` is silently ignored.
- **Missing fields get CLEARED to null**. Always include ALL fields when editing, especially `image`, `description`, `tags`.
- **`body` is always required**, even for metadata-only updates. Omitting it blanks the article content.
- **No parent-level update endpoint exists** — you cannot PUT/PATCH/POST to `/blogs/{parentId}` on any API layer. All updates go through article-level edit.

### Blog Category IDs
| ID | Category |
|----|----------|
| 7926 | Emotional Health |
| 7921 | Financial |
| 7925 | Family |
| 7924 | Medical |
| 7927 | Getting Started |
| 7923 | Housing |
| 7922 | Legal |

### Image Upload
- **Endpoint**: `POST /api/shops/14492/blogs/upload` (Dashboard API, needs session cookies)
- **Field**: multipart form, field name `photo`
- **Format**: JPEG only, under ~1MB
- **Returns**: URL to uploaded image on Selldone CDN
- **Then**: Include returned URL in `image` field of edit payload

### Browser-Based Operations
For operations requiring Dashboard API auth (categories, image upload), use Chrome extension `javascript_tool` to execute fetch() in browser context on `selldone.com` dashboard pages. The session cookies and XSRF token are automatically available. Example:
```javascript
const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1];
const resp = await fetch('/api/article/shop-blog/edit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(xsrf), 'Accept': 'application/json' },
  body: JSON.stringify({ article_id: ID, title: '...', body: '...', category: 7926, shop_id: 14492, published: true, image: '...' })
});
```

## APC Blog Current State (as of 2026-05-21)

- **45 articles** across 5 active categories: Emotional Health (15), Financial (12), Medical (9), Family (6), Housing (3)
- Getting Started and Legal categories exist but have 0 articles (originals deleted during dedup)
- **Categories restored** — all 45 articles have correct `category` assignments
- **Cover images missing** — all 45 articles have `image: null` (lost during CDN migration, needs re-upload)
- **Body images on external CDN** — some inline `<img>` tags still reference `fal.media` or Higgsfield cloudfront URLs. All new uploads MUST use Selldone CDN (`POST /api/shops/14492/blogs/upload`). Migrate legacy URLs when articles are next updated
- **Article dates** — all show 2026-05-21 (the migration date), need backdating
- **Custom Articles page** at `/pages/Articles` (page 27877) — parallel to native `/blog`, uses XAPI fetch
- **Homepage** at page 27869 — has push script at `H:\My Drive\...\push-homepage.py`
- **Push scripts**: `push-articles-page.py` and `push-homepage.py` in `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\`

## Common Workflows

### Publish a Blog Article
```
1. selldone_create_article(title, body="<h1>...</h1><p>...</p>", published=true, tags=["caregiving"])
2. Optionally: selldone_get_article_tags() to see existing tags
```

### Create a New Product
```
1. selldone_create_product(title, type="FILE", price=29.99, currency="USD")
2. selldone_set_product_quantity(product_id, quantity=100)
3. selldone_edit_product(product_id, status="Open")
```

### Check Store Health
```
1. selldone_get_statistics(type="sessions") — visitor traffic
2. selldone_list_orders(type="FILE", statuses=["Payed"]) — recent sales
3. selldone_list_customers(limit=10) — recent customers
```

### Edit Product Specs/Pros via Browser (when MCP tools unavailable)
```
1. Navigate to: selldone.com/shuttle/shop/14492/product/{id}/edit#spec
2. For specs: Click edit pencil → triple-click value → type new value → click checkmark → Ctrl+S
3. For specs modal (Add Item): Use form_input for fields + JavaScript b.click() for buttons
4. For pros: Go to Survey and Features tab → form_input title+value → JS click first elevated "Add" button
5. Always save with Ctrl+S (saves and advances to next tab)
```

### Run a Promotion
```
1. selldone_create_discount_code(code="SAVE20", discount=20, discount_type="PERCENT", end="2026-07-01T00:00:00Z")
2. selldone_create_email(name="Summer Sale", currency="USD", structure={...})
3. selldone_send_email(email_id=...)
```

## Direct API Access (for non-MCP agents)

For Hermes agents or other systems that can't use MCP, use direct HTTP:

```bash
# Base URLs
ERP_API="https://api.selldone.com"
XAPI="https://xapi.selldone.com"

# Auth header (same token for both)
AUTH="Authorization: Bearer $SELLDONE_API_TOKEN"

# Examples:
curl -H "$AUTH" "$ERP_API/shops/14492/products/all-admin?limit=10"
curl -H "$AUTH" "$XAPI/shops/@apc-nprUqKnD/blogs?limit=10"
curl -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"title":"New Post","body":"<p>Content</p>","shop_id":14492,"published":true}' \
  "$XAPI/article/shop-blog/edit"
```

## Token Info
- Token type: ERP OAuth JWT
- Generated via: `selldone.com/auth/erp?scopes[]=...`
- Scopes: shop:read/write, product:read/write, category:read/write, order:read/write, page:read/write, report:read, finance:read, customer:read/write, logistic:read/write, community:read/write, discount-code:read/write, coupon:read/write, articles, faq:read/write, profile, identification
- Stored in: `~/.claude/settings.json` → mcpServers.selldone.env.SELLDONE_API_TOKEN
