#!/usr/bin/env python3
"""Project orchestrator entry point. Cross-platform.

Usage:
  python run.py --brief path/to/brief.yaml
  python run.py --resume <slug>
"""
from __future__ import annotations
import argparse, json, os, pathlib, subprocess, sys, datetime, shutil

ROOT = pathlib.Path(os.environ.get("BOOK_PROD_ROOT",
    pathlib.Path.home() / ".claude" / "skills" / "book-prod"))
PROJECTS = pathlib.Path(os.environ.get("BOOK_PROJECTS",
    pathlib.Path.home() / "BookProjects"))

STEPS = [
    "brief_validated", "brand_resolved", "assets_processed",
    "activities_generated", "interior_built", "cover_built",
    "preflight_passed", "shopify_packaged",
]

def load_state(proj: pathlib.Path) -> dict:
    p = proj / "state.json"
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else {}

def save_state(proj: pathlib.Path, state: dict) -> None:
    (proj / "state.json").write_text(json.dumps(state, indent=2), encoding='utf-8')

def scaffold(slug: str) -> pathlib.Path:
    proj = PROJECTS / slug
    for sub in ("brand", "manuscript", "assets/source", "assets/processed",
                "assets/activities", "build", "out", "preflight"):
        (proj / sub).mkdir(parents=True, exist_ok=True)
    return proj

def step_brief_validated(proj, brief): return True
def step_brand_resolved(proj, brief):
    slug = brief.get("imprint", "lumosread")
    tokens = ROOT / "brand-system" / "assets" / "imprints" / f"{slug}.tokens.json"
    schema = ROOT / "_shared" / "schemas" / "brand-tokens.schema.json"
    out_dir = ROOT / "_shared" / "build" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    lib = ROOT / "_shared" / "lib"
    subprocess.check_call([sys.executable, str(lib/"tokens_to_typst.py"), str(tokens), str(out_dir/"variables.typ"), str(schema)])
    subprocess.check_call([sys.executable, str(lib/"tokens_to_latex.py"), str(tokens), str(out_dir/"tokens.sty"), str(schema)])
    subprocess.check_call([sys.executable, str(lib/"tokens_to_css.py"),   str(tokens), str(out_dir/"tokens.css"), str(schema)])
    return True

def step_assets_processed(proj, brief): print(f"[assets] processing {proj/'assets/source'}"); return True
def step_activities_generated(proj, brief): print("[activities] (stub)"); return True
def step_interior_built(proj, brief): print("[interior] (stub: invoke typst)"); return True
def step_cover_built(proj, brief): print("[cover] (stub)"); return True
def step_preflight_passed(proj, brief):
    script = ROOT / "preflight" / "scripts" / ("preflight.ps1" if os.name == "nt" else "preflight.sh")
    print(f"[preflight] would run {script} {proj}")
    return True
def step_shopify_packaged(proj, brief): print("[shopify] (stub)"); return True

STEP_FNS = {
    "brief_validated": step_brief_validated,
    "brand_resolved": step_brand_resolved,
    "assets_processed": step_assets_processed,
    "activities_generated": step_activities_generated,
    "interior_built": step_interior_built,
    "cover_built": step_cover_built,
    "preflight_passed": step_preflight_passed,
    "shopify_packaged": step_shopify_packaged,
}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--brief", type=pathlib.Path)
    p.add_argument("--slug", type=str)
    p.add_argument("--resume", action="store_true")
    a = p.parse_args()

    import yaml
    if a.brief:
        brief = yaml.safe_load(a.brief.read_text(encoding='utf-8'))
        slug = brief["slug"]
    else:
        slug = a.slug
        proj = PROJECTS / slug
        brief = yaml.safe_load((proj / "brief.yaml").read_text(encoding='utf-8'))

    proj = scaffold(slug)
    if a.brief:
        shutil.copy(a.brief, proj / "brief.yaml")

    state = load_state(proj)
    for step in STEPS:
        if state.get(step) == "done" and a.resume:
            print(f"[skip] {step}")
            continue
        print(f"[run]  {step}")
        ok = STEP_FNS[step](proj, brief)
        state[step] = "done" if ok else "failed"
        state[f"{step}_at"] = datetime.datetime.now().isoformat()
        save_state(proj, state)
        if not ok:
            print(f"[FAIL] {step}"); sys.exit(1)
    print(f"[OK] project {slug} complete at {proj}")

if __name__ == "__main__": main()
