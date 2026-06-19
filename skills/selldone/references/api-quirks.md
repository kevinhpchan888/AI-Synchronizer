# Selldone API Quirks & Gotchas

Critical bugs, workarounds, and undocumented behaviors discovered through production use. Violating any of these will cause data loss or broken pages.

## Article CRUD

### XAPI Edit Bug (CRITICAL)
The XAPI edit endpoint (`POST xapi.selldone.com/article/shop-blog/edit`) with an `id` field ALWAYS creates a NEW article instead of updating the existing one. This is a confirmed Selldone bug. Also: sending `article_id` field is NOT recognized by XAPI (returns "Article not found") and will trigger the missing-fields-cleared-to-null bug, wiping the article.

**Workaround for updates**: There is NO working in-place update on either API. Both XAPI and Dashboard API create a NEW article when `id` is included. The only way to "update" is delete + recreate.

**Category assignment**: XAPI ignores the `category` field entirely. You MUST use the Dashboard API (`POST selldone.com/api/article/shop-blog/edit`) with session cookies + XSRF token to set categories. The Dashboard API correctly sets `category` on CREATE (without `id` field). The category value is the blog category ID (integer), field name is `category`.

**Correct update pattern**: 1) GET full article via XAPI, 2) DELETE via Dashboard API (`DELETE /api/article/shop-blog/{article_id}`), 3) CREATE via Dashboard API (without `id`) with all fields including `category`.

**If using XAPI for create only**: Omit the `id` field entirely. XAPI create works but categories will NOT be set.

### Missing Fields Get Cleared to Null
When editing an article, any field NOT included in the payload gets set to null. You MUST include ALL fields every time, even for a metadata-only update.

**Always include**: title, body, image, description, published, private, lang, category, shop_id, slug, page_title, schedule_at, order, star, faqs, structures, cluster_id

### Category Field Name
The field is `category` (NOT `category_id`). Using `category_id` is silently ignored and the article ends up uncategorized.

### Body Always Required
Even for metadata-only updates, `body` must be included with the full HTML content. Omitting it blanks the article.

## Product Article Descriptions

### Endpoint: `POST /api/article/product/edit` (Dashboard API)
Product descriptions use a DIFFERENT endpoint from blog articles. Blog articles use `/api/article/shop-blog/edit`, but product articles use `/api/article/product/edit`.

**Required fields**: `article_id`, `product_id`, `title`, `body`, `shop_id`, `published`, `lang`
**Auth**: Session cookies + XSRF token (Dashboard API only)

```javascript
const xsrf = decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1]);
const resp = await fetch('/api/article/product/edit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf, 'Accept': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    article_id: 730076,   // from product.articles.id
    product_id: 700233,   // the product ID
    title: 'Product Title',
    body: '<p>HTML content</p>',
    shop_id: 14492,
    published: true,
    private: false,
    lang: 'en'
  })
});
```

**Key differences from blog articles:**
- Uses `/api/article/product/edit` NOT `/api/article/shop-blog/edit`
- Requires `product_id` field (blog articles don't have this)
- Does NOT have the "always creates new" bug — updates in place correctly
- The `blog` field on the product (via ERP PUT) is treated as a URL by the storefront READ MORE button — do NOT put HTML in it
- Product articles have `parent_type: "product"` internally

### Product Article IDs (current)
| Product ID | Article ID | Product |
|-----------|-----------|---------|
| 700233 | 730076 | The Aging Parent Caregiving Guide |
| 700234 | 730077 | The Aging Parent Caregiving Workbook |
| 700235 | 730078 | The Audiobook Edition |
| 700236 | 730082 | The Complete System |

## CMS Page Updates

### Content Must Be a JSON Object
When pushing page content via the API, the `content` field must be a Python dict / JS object (native JSON). If you `json.dumps()` it into a string, the page breaks with double-encoding. This has caused production outages.

### Push Script Must Use Python
PowerShell corrupts the JSON payload for CMS page updates. Always use the Python push scripts:
- Homepage: `push-homepage.py`
- Articles page: `push-articles-page.py`

Both at: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\`

## Image Upload

### Dashboard API Only
Image upload requires the Dashboard API (`selldone.com/api`), which needs session cookies + XSRF token. Bearer token auth returns 401.

### Product Images (CRITICAL)
Product images use TWO separate endpoints, both requiring Dashboard API auth:

| What | Endpoint | Effect |
|------|----------|--------|
| **Main icon** (listing thumbnail) | `POST /api/shops/{shop_id}/products/{product_id}/edit/upload/icon` | Sets the `icon` field |
| **Gallery image** (product page) | `POST /api/shops/{shop_id}/products/{product_id}/edit/upload/cover` | Adds to `images[]` array |

**Field**: multipart form, field name `photo`
**Format**: JPEG/PNG, under 3MB. Compress large PNGs via canvas before upload.
**Auth**: Session cookies + XSRF token (same as blog upload)

**API endpoint functions** (available in browser on Selldone dashboard):
```javascript
window.API.POST_UPLOAD_PRODUCT_MAIN_IMAGE(shop_id, product_id)  // → /api/shops/.../edit/upload/icon
window.API.POST_UPLOAD_PRODUCT_COVER(shop_id, product_id, variant_id)  // → /api/shops/.../edit/upload/cover
window.API.DELETE_PRODUCT_IMAGE(shop_id, product_id, image_id)  // → /api/shops/.../images/{id}/delete
```

**IMPORTANT**: The ERP API `PUT /shops/{id}/products/{id}/edit` does NOT accept image uploads via any field name. It returns 200 but silently ignores file data. Setting `icon` as a URL string also doesn't work. You MUST use the dedicated upload endpoints above.

### Blog Images

**Endpoint**: `POST /api/shops/14492/blogs/upload`
**Field**: multipart form, field name `photo`
**Format**: JPEG only, under ~1MB

### Browser Upload Method (preferred for all image uploads)
Use Chrome extension `javascript_tool` to execute fetch() in browser context on `selldone.com` dashboard pages where cookies are already present:
```javascript
const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1];
const formData = new FormData();
formData.append('photo', file);  // File or Blob, JPEG/PNG under 3MB
const resp = await fetch('/api/shops/14492/products/700236/edit/upload/icon', {
  method: 'POST',
  headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
  body: formData
});
```

### Image Compression Helper
For images over 3MB (common with fal.ai/CDN PNGs), compress in-browser before upload:
```javascript
const img = new Image();
img.crossOrigin = 'anonymous';
await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = URL.createObjectURL(blob); });
const canvas = document.createElement('canvas');
let w = img.width, h = img.height;
if (w > 1200 || h > 1200) { const s = 1200 / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
canvas.width = w; canvas.height = h;
canvas.getContext('2d').drawImage(img, 0, 0, w, h);
const jpegBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
```

## Three API Layers

| Layer | Base URL | Auth | When to Use |
|-------|----------|------|-------------|
| **ERP** | `api.selldone.com` | Bearer token | Products, orders, pages, categories, customers, stats |
| **XAPI** | `xapi.selldone.com` | Bearer token | Storefront data, blog articles, pages by name |
| **Dashboard** | `selldone.com/api` | Session cookies + XSRF | Image upload, category assignment on articles |

## Product Specs (Technical Specifications)

### Editing Specs via Dashboard UI
The Specifications tab in the product edit page uses Vuetify `v-overlay-container` for its modal/inline editing. Three approaches for interacting with spec fields, in order of reliability:

1. **Coordinate click+type** — works for input fields, unreliable for buttons across different products
2. **form_input with refs** — works for input fields, but ref-based button clicks are unreliable for Vuetify overlay buttons
3. **Hybrid: form_input for fields + JavaScript for buttons** — MOST RELIABLE

**The working pattern:**
```javascript
// After setting field values via form_input (ref-based), click Add Item with JS:
document.querySelectorAll('button').forEach(b => { 
  if (b.innerText && b.innerText.includes('Add Item')) b.click(); 
});

// Close the modal:
document.querySelectorAll('button').forEach(b => { 
  if (b.innerText && b.innerText.includes('Close')) b.click(); 
});
```

### Pros/Cons (Survey and Features Tab)
The "Add" button for Pros and Cons also uses Vuetify elevated buttons. Use the same JS click pattern:
```javascript
// Click the Pros "Add" button (first elevated Add button on page):
const buttons = document.querySelectorAll('button');
let count = 0;
for (const b of buttons) {
  if (b.innerText && b.innerText.includes('Add') && b.classList.contains('v-btn--elevated')) {
    count++;
    if (count === 1) { b.click(); break; } // 1st = Pros, 2nd = Cons
  }
}
```

### Saving Product Edits
`Ctrl+S` from any tab saves and advances to the next tab ("Save & Continue" behavior). This is the most reliable save method.

## Product IDs (Current Store State)

| Product ID | Article ID | Product | USD Price |
|-----------|-----------|---------|-----------|
| 700233 | 730076 | The Complete Aging Parent Caregiving Guide | $39 |
| 700234 | 730077 | The Complete Aging Parent Caregiving Workbook | $29 |
| 700235 | 730078 | The Aging Parent Caregiving Guide: Audiobook Edition | $29 |
| 700236 | 730082 | The Complete Aging Parent Caregiving System: Standard Edition | $54 |
| 700296 | — | The Complete Aging Parent Caregiving System: Premium Edition | $79 |

> All prices interim/temporary. Primary currency SGD, with USD/AUD/CAD/GBP/EUR enabled.

## Product Spec and Pros Editing (ERP API)

Standard product `PUT/POST /shops/{shop_id}/products/{id}` and `/edit` return 404. Spec and pros each have dedicated endpoints. Discovered May 2026.

### Spec — full replacement
```
POST https://api.selldone.com/shops/{shop_id}/products/{id}/spec
Authorization: Bearer {ERP_TOKEN}
Body: { "spec": { "FieldName": ["value"], ... } }
```
Sends the full spec dict. Replaces all keys. Each value is a list of strings. Response: `{ success: true, spec: {...}, spec_order: ... }`.

### Pros — update single pro by key
```
PUT https://api.selldone.com/shops/{shop_id}/products/{id}/pros
Authorization: Bearer {ERP_TOKEN}
Body: { "key": "<existing pro name>", "name": "<new name>", "value": "<description>" }
```
The `key` field is the existing pro's name (used as the identifier). `name` is the new name; reuse `key` if not renaming. `value` is the description. Pros are stored as a dict keyed by name, so renaming a pro effectively replaces it.

### Pros — add new
```
POST https://api.selldone.com/shops/{shop_id}/products/{id}/pros
Body: { "name": "<new pro name>", "value": "<description>" }
```
Hard cap: 5 pros per product. Returns `{ error: true, code: 72010, error_msg: "Up to 5 items can be added!" }` if exceeded.

### Pros — delete
Pattern not yet probed. Likely `DELETE /pros` with `{ key }`.

### Cons
Mirror of pros: same endpoint pattern, swap `/pros` for `/cons`.

## Notion Sync

- Workspace: AMV AI Group
- Blog Articles DB: `collection://5f63d4f0-61ba-4532-8c49-5e1979fca28f`
- Daily routine: `trig_011wMT6EN4kbJzcCADJQNGuQ` (6AM ET)
- Schema: Title, Article ID, Status, Theme, Date Created, Word Count, SEO Keywords, Category, Selldone URL
