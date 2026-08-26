#!/usr/bin/env python3
"""Compare the running app against the Figma exports in kit/figma-refs/.

    npm run build && PORT=8080 npm start &
    python3 kit/scripts/figma_compare.py

Writes a side-by-side PNG per screen into kit/figma-refs/out/ (Figma | app |
difference mask) and prints a table.

Figma exports each artboard with a 40px corner radius, so the canvas backdrop
and its antialiased ring show through the four corners. The web build is square
at phone width, so those corner wedges are excluded from the numbers rather than
chased in CSS.
"""
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit('needs Pillow:  pip install pillow')
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit('needs Playwright:  pip install playwright && playwright install chromium')

ROOT = Path(__file__).resolve().parents[2]
REFS = ROOT / 'kit' / 'figma-refs'
OUT = REFS / 'out'
URL = 'http://localhost:8080/'
CORNER_RADIUS = 40

# node id -> (reference file, frame height, nav tab to click first)
SCREENS = [
    ('2159:12771', 'Home',          '2159_12771_home.png',     856, None),
    ('2159:12891', 'Notebook list', '2159_12891_notebook.png', 844, 'Sổ tay'),
    ('2159:13180', 'Add link',      '2159_13180_add_link.png', 856, 'Thêm liên kết mới'),
]


def corner_mask(w, h):
    """False on pixels outside the artboard's rounded corners."""
    keep = bytearray([1]) * (w * h)
    r = CORNER_RADIUS
    for cx, cy, xs, ys in (
        (r, r, range(0, r), range(0, r)),
        (w - 1 - r, r, range(w - r, w), range(0, r)),
        (r, h - 1 - r, range(0, r), range(h - r, h)),
        (w - 1 - r, h - 1 - r, range(w - r, w), range(h - r, h)),
    ):
        for y in ys:
            for x in xs:
                if (x - cx) ** 2 + (y - cy) ** 2 > (r - 2) ** 2:
                    keep[y * w + x] = 0
    return keep


def capture(page, tab, height, dest):
    page.set_viewport_size({'width': 390, 'height': height})
    page.goto(URL, wait_until='networkidle')
    page.wait_for_timeout(900)
    if tab:
        page.get_by_role('button', name=tab).click()
        page.wait_for_timeout(800)
    page.screenshot(path=str(dest))
    broken = page.evaluate(
        "() => [...document.querySelectorAll('img')]"
        ".filter(i => !i.complete || i.naturalWidth === 0)"
        ".map(i => i.getAttribute('src'))"
    )
    return broken


def score(ref_path, shot_path):
    a = Image.open(ref_path).convert('RGB')
    b = Image.open(shot_path).convert('RGB')
    if a.size != b.size:
        return None, f'size mismatch: figma {a.size} vs app {b.size}'
    w, h = a.size
    keep = corner_mask(w, h)
    ad, bd = list(a.getdata()), list(b.getdata())
    acc = [0, 0, 0]
    n = big = 0
    for i in range(w * h):
        if not keep[i]:
            continue
        p, q = ad[i], bd[i]
        for c in range(3):
            acc[c] += abs(p[c] - q[c])
        n += 1
        if max(abs(p[c] - q[c]) for c in range(3)) > 28:
            big += 1
    return (acc[0] / n, acc[1] / n, acc[2] / n, 100 * big / n), None


def montage(ref_path, shot_path, dest):
    a = Image.open(ref_path).convert('RGB')
    b = Image.open(shot_path).convert('RGB')
    d = ImageChops.difference(a, b).convert('L').point(lambda v: 255 if v > 30 else 0)
    w, h = a.size
    sheet = Image.new('RGB', (w * 3 + 40, h), (18, 18, 18))
    sheet.paste(a, (0, 0))
    sheet.paste(b, (w + 20, 0))
    sheet.paste(d.convert('RGB'), (w * 2 + 40, 0))
    sheet.save(dest)


def main():
    try:
        subprocess.run(['curl', '-sf', '-o', '/dev/null', URL], check=True, timeout=10)
    except Exception:
        sys.exit(f'nothing serving {URL}\n  npm run build && PORT=8080 npm start &')

    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for node, name, ref, height, tab in SCREENS:
            ref_path = REFS / ref
            if not ref_path.exists():
                rows.append((node, name, None, f'missing reference {ref}'))
                continue
            shot = OUT / f'app_{ref}'
            broken = capture(page, tab, height, shot)
            stats, err = score(ref_path, shot)
            if err:
                rows.append((node, name, None, err))
                continue
            montage(ref_path, shot, OUT / f'compare_{ref}')
            note = f'{len(broken)} broken image(s)' if broken else ''
            rows.append((node, name, stats, note))
        browser.close()

    print()
    print(f'{"node":<13} {"screen":<15} {"mean abs diff / 255":<24} {"pixels >28":<11} note')
    print('-' * 82)
    worst = 0.0
    for node, name, stats, note in rows:
        if stats is None:
            print(f'{node:<13} {name:<15} {"-":<24} {"-":<11} {note}')
            continue
        r, g, bl, pct = stats
        worst = max(worst, r, g, bl)
        print(f'{node:<13} {name:<15} {r:5.2f} / {g:5.2f} / {bl:5.2f}      {pct:6.2f}%     {note}')
    print()
    print(f'side-by-side images: {OUT}')
    print('  each is  Figma | app | difference mask')
    print()
    print('Under ~5 means the layout matches and the residual is text antialiasing')
    print('and image re-encoding. Anything above ~8 means something is structurally off.')
    return 0 if worst < 8 else 1


if __name__ == '__main__':
    sys.exit(main())
