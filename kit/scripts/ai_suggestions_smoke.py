#!/usr/bin/env python3
"""Production regression walkthrough for the notebook AI Suggestions flow."""

import json
import os
import sys

from playwright.sync_api import sync_playwright


URL = os.environ.get('MNEME_URL', 'http://127.0.0.1:8080')
DETAILS = [
    ('Research với NotebookLM', 'Dùng NotebookLM để tóm tắt tài liệu'),
    ('Món ăn dễ nấu trong 15 phút', 'Bánh trứng phô mai'),
    ('AI Tips & Tricks', '10 prompt ChatGPT giúp làm việc nhanh gấp đôi'),
    ('Figma Tips & Tricks', '5 phím tắt Figma giúp thao tác nhanh gấp đôi'),
]


def visual_errors(page):
    return page.evaluate(
        """() => ({
          brokenImages: [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.src),
          visibleTextOverflow: [...document.querySelectorAll('p,h1,h2,h3,a,span,button')]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return style.overflowX === 'visible' && (rect.left < -0.5 || rect.right > 390.5);
            })
            .map((element) => element.textContent?.trim()).filter(Boolean),
          mainWidth: document.querySelector('main')?.scrollWidth,
        })"""
    )


def main() -> int:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.set_default_timeout(5_000)
        page_errors = []
        gemini_requests = []
        page.on('pageerror', lambda error: page_errors.append(str(error)))
        page.on(
            'request',
            lambda request: gemini_requests.append(request.url)
            if '/api/gemini/' in request.url else None,
        )

        page.goto(URL, wait_until='networkidle')
        page.evaluate('localStorage.clear()')
        page.reload(wait_until='networkidle')
        page.get_by_role('button', name='Sổ tay', exact=True).click()
        page.get_by_role('button', name='Cập nhật ngay', exact=True).click()
        page.get_by_role('heading', name='AI Suggestions').wait_for()

        list_scroll = page.locator('main').evaluate(
            '(main) => ({clientHeight: main.clientHeight, scrollHeight: main.scrollHeight})'
        )
        assert list_scroll['scrollHeight'] > list_scroll['clientHeight'], list_scroll

        for notebook_title, resource_title in DETAILS:
            page.get_by_role('button', name=f'Review {notebook_title}', exact=True).click()
            page.get_by_role('heading', name=notebook_title, exact=True).wait_for()
            page.get_by_text(resource_title, exact=True).first.wait_for()
            detail_scroll = page.locator('main').evaluate(
                '(main) => ({clientHeight: main.clientHeight, scrollHeight: main.scrollHeight})'
            )
            assert detail_scroll['scrollHeight'] > detail_scroll['clientHeight'], detail_scroll
            page.get_by_role('button', name='Quay lại', exact=True).click()
            page.get_by_role('heading', name='AI Suggestions').wait_for()

        page.get_by_role('button', name='Review Research với NotebookLM', exact=True).click()
        page.get_by_role('button', name='Thêm vào sổ tay', exact=True).first.click()
        page.get_by_role('button', name='Đã thêm vào sổ tay', exact=True).wait_for()
        page.get_by_role('button', name='Bỏ qua', exact=True).first.click()
        page.get_by_role('button', name='Đã bỏ qua', exact=True).click()
        page.get_by_text('Research với NotebookLM', exact=True).wait_for()

        errors = visual_errors(page)
        assert not page_errors, page_errors
        assert not gemini_requests, gemini_requests
        assert not errors['brokenImages'], errors
        assert not errors['visibleTextOverflow'], errors
        assert errors['mainWidth'] == 390, errors
        browser.close()

    print(json.dumps({
        'route': '7956 -> 5336 -> 5510/5409/5614/5717',
        'detail_variants': len(DETAILS),
        'phone_scroll': True,
        'text_contained': True,
        'gemini_requests': 0,
    }, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
