#!/usr/bin/env python3
"""
apc_publish.py - the ONE canonical publisher (PIPELINE.md step 4).

Unattended, idempotent, re-runnable. Designed to run on a frequent schedule on the
always-on Mac Mini (scheduled task `apc-publish`, every ~2h) so the ONLY manual step in
the whole engine is Kevin generating the two images and saving them in the drop folder.
The moment both images for a `ready` article are present, the next run signs them, uploads
them to the Selldone blog CDN (Bearer-token multipart - no browser/XSRF needed), builds the
body, creates the post in its category, records the result, optionally syncs Notion, and
archives the images. Articles whose images aren't there yet are skipped and listed.

Why this works unattended (the old "PC-only" boundary is gone):
  - signature: composited here with Pillow; the asset ships in the repo (assets/), no H: needed.
  - CDN upload: api.selldone.com/shops/<id>/blogs/upload accepts Bearer + multipart from any host.
  - drop folder: a normal directory (Drive-mounted on the Mac, or any path via APC_DROP_DIR).

Inputs (env, all optional - sensible defaults):
  SELLDONE_API_TOKEN   required. Falls back to ~/.claude/settings.json mcpServers.selldone.env.
  APC_DROP_DIR         folder Kevin saves images into. Default: the H: NEW ARTICLE IMAGES path.
  APC_SIG              signature PNG. Default: repo assets/APC_Signature_Transparent.png.
  APC_ARCHIVE_DIR      where published images move to. Default: <drop>/_published.
  NOTION_API_TOKEN     optional. If set, flips the Blog Articles page to Published + cover.

Manifests: every dict in output/**/ready/*.json (a list) is a publishable article:
  {slug,title,page_title,description,category_id,body_file,ba_id?,images?{starting,midpoint}}
  body_file is relative to the manifest and contains [[STARTING_IMG]] / [[MIDPOINT_IMG]] slots.

Usage:
  python apc_publish.py --dry     # match images, show plan, write nothing
  python apc_publish.py           # publish every ready article whose 2 images are present
  python apc_publish.py --only <slug>
"""
import argparse, glob, json, os, re, subprocess, sys, uuid, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))          # skills/apc-article-ops
SHOP_ID = 14492
SHOP_SLUG = '@apc-nprUqKnD'
UPLOAD_URL = f'https://api.selldone.com/shops/{SHOP_ID}/blogs/upload'
EDIT_URL = 'https://xapi.selldone.com/article/shop-blog/edit'
LIST_URL = f'https://xapi.selldone.com/shops/{SHOP_SLUG}/blogs?limit=500&offset=0'

DROP = os.environ.get('APC_DROP_DIR',
    r'H:/My Drive/DIGITAL PRODUCTS/THE AGING PARENT CARE GIVING SYSTEM/ARTICLES/Article_Images/NEW ARTICLE IMAGES')
SIG = os.environ.get('APC_SIG', os.path.join(ROOT, 'assets', 'APC_Signature_Transparent.png'))
ARCHIVE = os.environ.get('APC_ARCHIVE_DIR', os.path.join(DROP, '_published'))
SIGNER = os.path.join(HERE, 'sign_illustrations.py')
SIGNED_DIR = os.path.join(HERE, '.signed_cache')

START_TAG = '<img src="{url}" alt="Starting Illustration" style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin-bottom:24px">'
MID_TAG = '<img src="{url}" alt="Midpoint Illustration" style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin:32px 0">'
STOP = set('the a an of for to in and or how what is your you parent parents aging elderly as it get'.split())


def token():
    t = os.environ.get('SELLDONE_API_TOKEN')
    if t:
        return t
    settings = os.path.expanduser('~/.claude/settings.json')
    with open(settings, encoding='utf-8-sig') as f:
        return json.load(f)['mcpServers']['selldone']['env']['SELLDONE_API_TOKEN']


TOKEN = None  # set in main()


def http(url, data=None, headers=None, method='GET'):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


def toks(s):
    return set(t for t in re.split(r'[^a-z0-9]+', s.lower()) if t and t not in STOP and len(t) > 2)


def live_slugs():
    """Idempotency: slugs already published, so we never double-create."""
    s, txt = http(LIST_URL, headers={'Authorization': f'Bearer {TOKEN}', 'Accept': 'application/json'})
    if s != 200:
        print(f'  WARN: could not list live blogs (HTTP {s}); proceeding without dedup')
        return set()
    out = set()
    for a in (json.loads(txt).get('articles') or []):
        sl = (a.get('slug') or (a.get('parent') or {}).get('slug'))
        if sl:
            out.add(sl)
    return out


def find_images(art, files):
    """Prefer deterministic BA-{N}_{slug}_{starting|midpoint}; fall back to token match."""
    explicit = art.get('images') or {}
    if explicit.get('starting') and explicit.get('midpoint'):
        return explicit['starting'], explicit['midpoint']
    ba = (art.get('ba_id') or '').replace('BA-', '').replace('BA', '').strip()
    slug = art['slug']
    def exact(kind):
        for f in files:
            base = os.path.splitext(f)[0].lower()
            if kind in base and (not ba or ba in re.findall(r'\d+', base)) and (toks(slug) & toks(base)):
                return f
        return None
    def fuzzy(kind):
        cands = [f for f in files if kind in f.lower()]
        cands.sort(key=lambda f: len(toks(os.path.splitext(f)[0]) & toks(slug)), reverse=True)
        return cands[0] if cands and (toks(os.path.splitext(cands[0])[0]) & toks(slug)) else None
    st = exact('start') or fuzzy('start')
    mid = exact('mid') or fuzzy('mid')
    return st, mid


def sign(raw_name):
    subprocess.run([sys.executable, SIGNER, '--in', DROP, '--sig', SIG, '--out', SIGNED_DIR],
                   check=False, capture_output=True)
    signed = os.path.join(SIGNED_DIR, os.path.splitext(raw_name)[0] + '.jpg')
    # hard gate: the file must exist AND pass --check
    if not os.path.isfile(signed):
        raise RuntimeError(f'signed file missing for {raw_name}')
    g = subprocess.run([sys.executable, SIGNER, '--check', signed], capture_output=True)
    if g.returncode != 0:
        raise RuntimeError(f'signature gate failed for {raw_name}: {g.stdout.decode()[:160]}')
    return signed


def upload(path):
    b = '----apc' + uuid.uuid4().hex
    fn = os.path.basename(path)
    body = (f'--{b}\r\nContent-Disposition: form-data; name="photo"; filename="{fn}"\r\n'
            f'Content-Type: image/jpeg\r\n\r\n').encode() + open(path, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    s, txt = http(UPLOAD_URL, data=body, method='POST', headers={
        'Authorization': f'Bearer {TOKEN}', 'Accept': 'application/json',
        'Content-Type': f'multipart/form-data; boundary={b}'})
    if s != 200:
        raise RuntimeError(f'upload HTTP {s}: {txt[:200]}')
    j = json.loads(txt)
    fl = j.get('files')
    url = (fl[0]['url'] if isinstance(fl, list) and fl else
           fl.get('url') if isinstance(fl, dict) else j.get('url'))
    if not url:
        raise RuntimeError(f'no url in upload response: {txt[:200]}')
    return url


def notion_sync(slug, parent_id, cover):
    """Best-effort: flip the Blog Articles page to Published + set cover. No-op without token."""
    nt = os.environ.get('NOTION_API_TOKEN')
    ds = os.environ.get('NOTION_BLOG_DS', '5f63d4f0-61ba-4532-8c49-5e1979fca28f')
    if not nt:
        return 'skipped (no NOTION_API_TOKEN)'
    h = {'Authorization': f'Bearer {nt}', 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json'}
    q = {'filter': {'property': 'URL Slug', 'rich_text': {'contains': slug[:90]}}, 'page_size': 1}
    s, txt = http(f'https://api.notion.com/v1/databases/{ds}/query',
                  data=json.dumps(q).encode(), headers=h, method='POST')
    if s != 200:
        return f'query HTTP {s}'
    res = json.loads(txt).get('results') or []
    if not res:
        return 'no matching page'
    pid = res[0]['id']
    patch = {'properties': {'Status': {'select': {'name': 'Published'}}}}
    if cover:
        patch['cover'] = {'type': 'external', 'external': {'url': cover}}
    s2, _ = http(f'https://api.notion.com/v1/pages/{pid}', data=json.dumps(patch).encode(),
                 headers=h, method='PATCH')
    return 'ok' if s2 == 200 else f'patch HTTP {s2}'


def main():
    global TOKEN
    ap = argparse.ArgumentParser()
    ap.add_argument('--only')
    ap.add_argument('--dry', action='store_true')
    a = ap.parse_args()
    if not a.dry:
        TOKEN = token()

    manifests = sorted(glob.glob(os.path.join(ROOT, 'output', '**', 'ready', '*.json'), recursive=True))
    arts = []
    for mf in manifests:
        try:
            data = json.load(open(mf, encoding='utf-8'))
        except Exception:
            continue
        for art in (data if isinstance(data, list) else [data]):
            if isinstance(art, dict) and art.get('slug') and art.get('body_file'):
                art['_manifest_dir'] = os.path.dirname(mf)
                arts.append(art)
    if a.only:
        arts = [x for x in arts if x['slug'] == a.only]
    if not arts:
        print('No ready manifests found under output/**/ready/. Nothing to do.')
        return

    files = [os.path.basename(p) for p in glob.glob(os.path.join(DROP, '*'))
             if p.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))] if os.path.isdir(DROP) else []
    already = set() if a.dry else live_slugs()
    os.makedirs(ARCHIVE, exist_ok=True) if (not a.dry and os.path.isdir(DROP)) else None

    results, waiting = {}, []
    for art in arts:
        slug = art['slug']
        if slug in already:
            results[slug] = 'skip (already live)'
            continue
        st, mid = find_images(art, files)
        if not st or not mid:
            waiting.append(f"{slug} (starting={st or 'MISSING'}, midpoint={mid or 'MISSING'})")
            continue
        if a.dry:
            results[slug] = f'dry-ok  start<-{st}  mid<-{mid}'
            continue
        try:
            st_cdn = upload(sign(st))
            mid_cdn = upload(sign(mid))
            body = open(os.path.join(art['_manifest_dir'], art['body_file']), encoding='utf-8').read()
            body = body.replace('[[STARTING_IMG]]', START_TAG.format(url=st_cdn)) \
                       .replace('[[MIDPOINT_IMG]]', MID_TAG.format(url=mid_cdn))
            payload = {'type': 'Blog', 'shop_id': SHOP_ID, 'title': art['title'], 'slug': slug,
                       'page_title': art.get('page_title', art['title']),
                       'description': art.get('description', ''), 'body': body, 'image': st_cdn,
                       'published': True, 'private': False, 'lang': 'en', 'multi_language': False,
                       'category': art['category_id'], 'faqs': [], 'order': 0}
            s, txt = http(EDIT_URL, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                          headers={'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json',
                                   'Accept': 'application/json'}, method='POST')
            if s not in (200, 201):
                raise RuntimeError(f'CREATE HTTP {s}: {txt[:300]}')
            pid = (json.loads(txt).get('article') or {}).get('parent_id')
            nsync = notion_sync(slug, pid, st_cdn)
            for f in (st, mid):
                try:
                    os.replace(os.path.join(DROP, f), os.path.join(ARCHIVE, f))
                except OSError:
                    pass
            results[slug] = f'PUBLISHED parent_id={pid} notion={nsync} cover={st_cdn}'
        except Exception as ex:
            results[slug] = f'ERROR: {ex}'
        print(f'  {slug}: {results[slug]}')

    print('\n==== SUMMARY ====')
    for k, v in results.items():
        print(f'  {k}: {v}')
    if waiting:
        print('\n  still waiting on images:')
        for w in waiting:
            print(f'    - {w}')
    sys.exit(1 if any(isinstance(v, str) and v.startswith('ERROR') for v in results.values()) else 0)


if __name__ == '__main__':
    main()
