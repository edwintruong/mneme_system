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
    ('2172:4416', 'Home (showcase)', '2172_4416_home.png',      856, None),
    ('2172:4258', 'Link detail (crepe)', '2172_4258_link_detail_crepe.png', 845, 'Recent crepe'),
    ('2172:4313', 'Link detail (prompt)', '2172_4313_link_detail_prompt.png', 845, 'Recent prompt'),
    ('2172:4365', 'Link detail (movie)', '2172_4365_link_detail_movie.png', 845, 'Recent movie'),
    ('2172:5822', 'Category (movie showcase)', '2172_5822_category_movie.png', 850, 'Category Movie'),
    ('2172:6335', 'Category (study)', '2172_6335_category_study.png', 850, 'Category Study'),
    ('2172:6390', 'Folder (languages)', '2172_6390_folder_languages.png', 843, 'Folder Ngoại ngữ'),
    ('2172:6504', 'Folder (work skills)', '2172_6504_folder_work_skills.png', 843, 'Folder Kỹ năng làm việc'),
    ('2172:6618', 'Folder (study materials)', '2172_6618_folder_study_materials.png', 843, 'Folder Tài liệu học tập'),
    ('2172:6732', 'Folder (AI tools)', '2172_6732_folder_ai_tools.png', 843, 'Folder Công cụ AI'),
    ('2172:6846', 'Category (travel)', '2172_6846_category_travel.png', 856, 'Category Travel'),
    ('2172:6901', 'Folder (Vietnam)', '2172_6901_folder_vietnam.png', 843, 'Folder Việt Nam'),
    ('2172:7359', 'Category (cake)', '2172_7359_category_cake.png', 856, 'Category Cake'),
    ('2159:12891', 'Notebook list', '2159_12891_notebook.png', 844, 'Sổ tay'),
    ('2159:13180', 'Add link',      '2159_13180_add_link.png', 856, 'Thêm liên kết mới'),
    ('2159:12980', 'Link detail',   '2159_12980_link_detail.png', 844, 'Link detail'),
    ('2159:13036', 'Category list', '2159_13036_category.png', 856, 'Phim ảnh'),
    ('2159:13091', 'Create folder', '2159_13091_create_folder.png', 858, 'Create folder'),
    ('2159:13158', 'Empty folder',  '2159_13158_empty_folder.png', 856, 'Empty folder'),
    ('2159:13174', 'Folder detail', '2159_13174_folder_detail.png', 843, 'Folder detail'),
    ('2159:12842', 'Notebook detail', '2159_12842_notebook_detail.png', 844, 'Notebook detail'),
    ('2172:7907', 'Notebook detail (showcase)', '2172_7907_notebook_detail.png', 844, 'Notebook detail'),
    ('2172:4487', 'Notebook TOC (Research)', '2172_4487_notebook_toc_research.png', 844, 'Notebook detail'),
    ('2172:4589', 'Notebook reading (Research)', '2172_4589_notebook_reading_research.png', 844, 'Notebook reading (Research)'),
    ('2172:5069', 'Notebook TOC (Món ăn)', '2172_5069_notebook_toc_food.png', 844, 'Notebook TOC (Món ăn)'),
    ('2172:5216', 'Notebook reading (Món ăn)', '2172_5216_notebook_reading_food.png', 844, 'Notebook reading (Món ăn)'),
    ('2172:5118', 'Notebook TOC (AI Tips)', '2172_5118_notebook_toc_aitips.png', 844, 'Notebook TOC (AI Tips)'),
    ('2172:5256', 'Notebook reading (AI Tips)', '2172_5256_notebook_reading_aitips.png', 844, 'Notebook reading (AI Tips)'),
    ('2172:5167', 'Notebook TOC (Travel)', '2172_5167_notebook_toc_travel.png', 844, 'Notebook TOC (Travel)'),
    ('2172:5296', 'Notebook reading (Travel)', '2172_5296_notebook_reading_travel.png', 844, 'Notebook reading (Travel)'),
    # Nodes 2159:13626 and 2159:13570 are no longer reachable in the active
    # storyboard. "Tạo sổ tay" now opens showcase node 2172:4631 directly.
    ('2172:4631', 'Select sources (showcase)', '2172_4631_select_sources.png', 844, 'Select sources'),
    ('2172:4536', 'Notebook list (showcase)', '2172_4536_notebook_list.png', 844, 'Sổ tay'),
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
    ('2172:4208', 'Activity',      '2172_4208_activity.png',  824, 'Hoạt động'),
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
        if tab == 'Recent crepe':
            page.get_by_role('button', name='Công thức bánh crepe', exact=True).click()
        elif tab == 'Recent prompt':
            page.get_by_role('button', name='Tối ưu prompt AI', exact=True).click()
        elif tab == 'Recent movie':
            page.get_by_role('button', name='Phim hay mùa hè 2026', exact=True).click()
        elif tab == 'Category Study':
            page.get_by_role('button', name='Học tập & Công việc 24 mục').click()
        elif tab == 'Category Movie':
            page.get_by_role('button', name='Phim ảnh 10 mục').click()
        elif tab in ('Folder Ngoại ngữ', 'Folder Kỹ năng làm việc', 'Folder Tài liệu học tập', 'Folder Công cụ AI'):
            page.get_by_role('button', name='Học tập & Công việc 24 mục').click()
            folder_name = tab.removeprefix('Folder ')
            folder_counts = {
                'Ngoại ngữ': 18,
                'Kỹ năng làm việc': 15,
                'Tài liệu học tập': 20,
                'Công cụ AI': 12,
            }
            page.get_by_role('button', name=f'{folder_name} {folder_counts[folder_name]} links').click()
        elif tab == 'Category Travel':
            page.get_by_role('button', name='Du lịch 10 mục').click()
        elif tab in ('Folder Việt Nam', 'Folder Nhật Bản', 'Folder Đông Nam Á', 'Folder Mẹo du lịch tiết kiệm'):
            page.get_by_role('button', name='Du lịch 10 mục').click()
            folder_name = tab.removeprefix('Folder ')
            folder_counts = {
                'Việt Nam': 22,
                'Nhật Bản': 14,
                'Đông Nam Á': 16,
                'Mẹo du lịch tiết kiệm': 11,
            }
            page.get_by_role('button', name=f'{folder_name} {folder_counts[folder_name]} links').click()
        elif tab == 'Category Cake':
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
        elif tab == 'Link detail':
            page.get_by_role('button', name='Enter search terms...').click()
            page.get_by_placeholder('Tìm link, folder hoặc category...').fill('Bún chả Hà Nội')
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
        elif tab == 'Notebook reading (Research)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Research với NotebookLM').click()
            page.get_by_role('button', name='Xem sổ tay').click()
        elif tab == 'Notebook TOC (Món ăn)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Món ăn dễ nấu trong 15’').click()
        elif tab == 'Notebook reading (Món ăn)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Món ăn dễ nấu trong 15’').click()
            page.get_by_role('button', name='Xem sổ tay').click()
        elif tab == 'Notebook TOC (AI Tips)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='AI Tips & Tricks').click()
        elif tab == 'Notebook reading (AI Tips)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='AI Tips & Tricks').click()
            page.get_by_role('button', name='Xem sổ tay').click()
        elif tab == 'Notebook TOC (Travel)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Đánh giá địa điểm du lịch').click()
        elif tab == 'Notebook reading (Travel)':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Đánh giá địa điểm du lịch').click()
            page.get_by_role('button', name='Xem sổ tay').click()
        elif tab == 'Select sources':
            page.get_by_role('button', name='Sổ tay').click()
            page.get_by_role('button', name='Tạo sổ tay').click()
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
        elif tab in ('Folder Bánh Âu', 'Folder Bánh Á', 'Folder Bánh không cần lò nướng', 'Folder Trang trí bánh'):
            page.get_by_role('button', name='Công thức bánh 10 mục').click()
            folder_name = tab.removeprefix('Folder ')
            folder_counts = {
                'Bánh Âu': 16,
                'Bánh Á': 13,
                'Bánh không cần lò nướng': 19,
                'Trang trí bánh': 9,
            }
            page.get_by_role('button', name=f'{folder_name} {folder_counts[folder_name]} links').click()
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
