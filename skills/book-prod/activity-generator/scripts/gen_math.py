#!/usr/bin/env python3
"""Generate math worksheets per grade level.

Operations: add, sub, mul, div, mixed.
Difficulty controlled by --max (largest operand).

Usage: gen_math.py --op add --count 30 --max 20 --out outdir --name addition_g1
Output: Markdown worksheet + answer key.
"""
import argparse, random, pathlib

def gen(op, max_val, rng):
    a = rng.randint(1, max_val)
    b = rng.randint(1, max_val)
    if op == "sub" and b > a: a, b = b, a
    if op == "div":
        b = max(rng.randint(1, max(2, max_val // 2)), 1)
        a = b * rng.randint(1, max_val // max(b,1) or 1)
    sym = {"add":"+", "sub":"−", "mul":"×", "div":"÷"}[op]
    ans = {"add": a+b, "sub": a-b, "mul": a*b, "div": a//b}[op]
    return f"{a} {sym} {b} = ____", str(ans)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--op", choices=["add","sub","mul","div","mixed"], default="add")
    p.add_argument("--count", type=int, default=30)
    p.add_argument("--max", dest="max_val", type=int, default=20)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="math")
    p.add_argument("--seed", type=int, default=42)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    rng = random.Random(a.seed)
    ws = [f"# Math Worksheet — {a.op}\n"]
    key = [f"# Answer Key — {a.op}\n"]
    ops = ["add","sub","mul","div"] if a.op == "mixed" else [a.op]
    for i in range(1, a.count + 1):
        op = rng.choice(ops)
        q, ans = gen(op, a.max_val, rng)
        ws.append(f"{i:>3}. {q}")
        key.append(f"{i}. {ans}")
    (a.out / f"{a.name}.md").write_text("\n".join(ws) + "\n", encoding="utf-8")
    (a.out / f"{a.name}_key.md").write_text("\n".join(key) + "\n", encoding="utf-8")
    print(f"math -> {a.out / a.name}.md")

if __name__ == "__main__":
    main()
