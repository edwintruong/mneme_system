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
    ('2159:12980', 'Link detail',   '2159_12980_link_detail.png', 844, 'Link detail'),
    ('2159:13036', 'Category list', '2159_13036_category.png', 856, 'Phim ảnh'),
    ('2159:13091', 'Create folder', '2159_13091_create_folder.png', 858, 'Create folder'),
    ('2159:13158', 'Empty folder',  '2159_13158_empty_folder.png', 856, 'Empty folder'),
    ('2159:13174', 'Folder detail', '2159_13174_folder_detail.png', 843, 'Folder detail'),
    ('2159:12842', 'Notebook detail', '2159_12842_notebook_detail.png', 844, 'Notebook detail'),
    ('2159:13626', 'Create notebook', '2159_13626_create_notebook.png', 844, 'Create notebook'),
    ('2159:13570', 'Select sources', '2159_13570_select_sources.png', 844, 'Select sources'),
    ('2172:5877', 'Folder detail (Phim Hàn, showcase)', '2172_5877_folder_detail_phimhan.png', 843, 'Folder Phim Hàn'),
    ('2172:5991', 'Folder detail (Phim kinh dị, showcase)', '2172_5991_folder_detail_phimkinhdi.png', 843, 'Folder Phim kinh dị'),
    ('2172:6105', 'Folder detail (Phim ngắn, showcase)', '2172_6105_folder_detail_phimngan.png', 843, 'Folder Phim ngắn'),
    ('2172:6221', 'Folder detail (Anime, showcase)', '2172_6221_folder_detail_anime.png', 843, 'Folder Anime'),
    ('2172:7015', 'Folder detail (Nhật Bản, showcase)', '2172_7015_folder_detail_nhatban.png', 843, 'Folder Nhật Bản'),
    ('2172:7130', 'Folder detail (Đông Nam Á, showcase)', '2172_7130_folder_detail_dongnama.png', 843, 'Folder Đông Nam Á'),
    ('2172:7244', 'Folder detail (Mẹo du lịch, showcase)', '2172_7244_folder_detail_meodulich.png', 843, 'Folder Mẹo du lịch tiết kiệm'),
    ('2172:7414', 'Folder detail (Bánh Âu, showcase)', '2172_7414_folder_detail_banhau.png', 843, 'Folder Bánh Âu'),
    ('2172:7512', 'Folder detail (Bánh Á, showcase)', '2172_7512_folder_detail_banha.png', 843, 'Folder Bánh Á'),
    ('2172:7610', 'Folder detail (Bánh không lò, showcase)', '2172_7610_folder_detail_banhkhongcanlo.png', 843, 'Folder Bánh không cần lò nướng'),
    ('2172:7704', 'Folder detail (Trang trí bánh, showcase)', '2172_7704_folder_detail_trangtribanh.png', 837, 'Folder Trang trí bánh'),
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
    # Every comparison starts from the committed seed rather than a mutation
    # left by an earlier screen in this same browser context.
    page.evaluate('localStorage.clear()')
    page.reload(wait_until='networkidle')
    page.wait_for_timeout(900)
    if tab:
        if tab == 'Link detail':
            page.get_by_role('button', name='Hoạt động').click()
            page.get_by_text('Bún chả Hà Nội ngon ở phố cổ', exact=True).click()
        elif tab == 'Create folder':
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Tạo folder').click()
        elif tab in ('Empty folder', 'Folder detail'):
            if tab == 'Empty folder':
                page.evaluate(
                    """() => {
                      const key = 'mneme_links_v1';
                      const links = JSON.parse(localStorage.getItem(key) || '[]');
                      localStorage.setItem(key, JSON.stringify(links.filter(link => link.folder !== 'Phim tài liệu')));
                    }"""
                )
                page.reload(wait_until='networkidle')
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Xem tất cả folder').click()
        elif tab == 'Notebook detail':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Research với NotebookLM').click()
        elif tab == 'Create notebook':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Tạo sổ tay').click()
        elif tab == 'Select sources':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Tạo sổ tay').click()
            page.get_by_role('button', name='Tạo từ các nội dung đã chọn').click()
        elif tab == 'Folder Phim Hàn':
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Phim Hàn 24 links').click()
        elif tab == 'Folder Phim kinh dị':
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Phim kinh dị 24 links').click()
        elif tab == 'Folder Phim ngắn':
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Phim ngắn 24 links').click()
        elif tab == 'Folder Anime':
            page.get_by_role('button', name='Phim ảnh').click()
            page.get_by_role('button', name='Anime 24 links').click()
        elif tab == 'Folder Nhật Bản':
            page.get_by_role('button', name='Du lịch').click()
            page.get_by_role('button', name='Nhật Bản 24 links').click()
        elif tab == 'Folder Đông Nam Á':
            page.get_by_role('button', name='Du lịch').click()
            page.get_by_role('button', name='Đông Nam Á 24 links').click()
        elif tab == 'Folder Mẹo du lịch tiết kiệm':
            page.get_by_role('button', name='Du lịch').click()
            page.get_by_role('button', name='Mẹo du lịch tiết kiệm 24 links').click()
        elif tab == 'Folder Bánh Âu':
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
            page.get_by_role('button', name='Bánh Âu 24 links').click()
        elif tab == 'Folder Bánh Á':
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
            page.get_by_role('button', name='Bánh Á 24 links').click()
        elif tab == 'Folder Bánh không cần lò nướng':
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
            page.get_by_role('button', name='Bánh không cần lò nướng 24 links').click()
        elif tab == 'Folder Trang trí bánh':
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
            page.get_by_role('button', name='Trang trí bánh 24 links').click()
        else:
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
