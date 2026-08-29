#!/usr/bin/env python3
"""Regression smoke test for persisted notebook schemas and the fake-AI flow.

Run against a production server:
  npm run build
  PORT=8080 npm start
  python3 kit/scripts/notebook_flow_smoke.py
"""

import json
import os
import sys

from playwright.sync_api import sync_playwright


URL = os.environ.get('MNEME_URL', 'http://127.0.0.1:8080')
NOTEBOOK_KEY = 'mneme_notebooks_v1'


def open_app(browser):
    page = browser.new_page(viewport={'width': 390, 'height': 856})
    page.set_default_timeout(5_000)
    page.goto(URL, wait_until='networkidle')
    return page


def main() -> int:
    stale_research = [{
        'id': 1,
        'title': 'Research với NotebookLM',
        'description': 'legacy record without outline/meta/summary',
        'image': '/assets/icons/figma_2159/2159_12891_notebooklm.svg',
        'itemCount': 24,
        'sections': [],
        'createdAt': '2/2/2022',
    }]

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()

        page = open_app(browser)
        page_errors = []
        gemini_requests = []
        page.on('pageerror', lambda error: page_errors.append(str(error)))
        page.on(
            'request',
            lambda request: gemini_requests.append(request.url)
            if '/api/gemini/' in request.url else None,
        )
        page.evaluate(
            '(value) => localStorage.setItem("mneme_notebooks_v1", JSON.stringify(value))',
            stale_research,
        )
        page.reload(wait_until='networkidle')
        page.get_by_role('button', name='Sổ tay', exact=True).click()
        page.get_by_role('button', name='Tạo sổ tay', exact=True).click()
        page.get_by_role('button', name='Tạo từ các nội dung đã chọn').click()
        page.get_by_role('button', name='Tiếp tục', exact=True).click()
        page.get_by_role('heading', name='Research với NotebookLM').wait_for()
        migrated = page.evaluate(f'JSON.parse(localStorage.getItem("{NOTEBOOK_KEY}"))')
        assert not page_errors, page_errors
        assert not gemini_requests, gemini_requests
        assert len(migrated) == 4
        assert isinstance(migrated[0].get('outline'), list)
        assert migrated[0].get('meta')
        page.close()

        page = open_app(browser)
        page_errors = []
        page.on('pageerror', lambda error: page_errors.append(str(error)))
        page.evaluate(f'localStorage.setItem("{NOTEBOOK_KEY}", "{{bad")')
        page.reload(wait_until='networkidle')
        page.get_by_role('button', name='Sổ tay', exact=True).click()
        assert page.get_by_text('Research với NotebookLM', exact=True).count() > 0
        assert not page_errors, page_errors
        recovered = page.evaluate(f'JSON.parse(localStorage.getItem("{NOTEBOOK_KEY}"))')
        assert len(recovered) == 4
        page.close()

        page = open_app(browser)
        page_errors = []
        page.on('pageerror', lambda error: page_errors.append(str(error)))
        legacy_duplicates = [
            {'id': 901, 'title': 'Self-care · Tổng hợp'},
            {'id': 902, 'title': 'Self care tổng hợp'},
            {'id': 903, 'title': 'Sổ tay cá nhân cần giữ lại'},
        ]
        page.evaluate(
            '(value) => localStorage.setItem("mneme_notebooks_v1", JSON.stringify(value))',
            legacy_duplicates,
        )
        page.reload(wait_until='networkidle')
        cleaned = page.evaluate(f'JSON.parse(localStorage.getItem("{NOTEBOOK_KEY}"))')
        cleaned_titles = [notebook.get('title') for notebook in cleaned]
        assert 'Self-care · Tổng hợp' not in cleaned_titles
        assert 'Self care tổng hợp' not in cleaned_titles
        assert 'Sổ tay cá nhân cần giữ lại' in cleaned_titles
        assert len(cleaned) == 5
        assert not page_errors, page_errors
        page.close()

        browser.close()

    print(json.dumps({
        'stale_schema_migrated': True,
        'malformed_json_recovered': True,
        'legacy_self_care_duplicates_removed': 2,
        'gemini_requests_in_showcase_flow': 0,
    }, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
