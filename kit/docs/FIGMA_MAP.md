# Figma implementation map

Source file: `8T9Olnto5GDBzUjXyP1ybY`.

Active source-of-truth section: `2159:12770`. Section `2143:4235` is legacy reference only.

| Flow/state | Active Figma node | Dart screen | Status |
| --- | --- | --- | --- |
| Home | `2159:12771` | `home/home_screen.dart` | Implemented and emulator-compared |
| Home, add-link toast | `2159:13227` | `home/home_screen.dart` | Implemented, flow-tested, and emulator-compared |
| Home variant | `2159:13303` | pending | Pending |
| Home variant | `2159:13676` | pending | Pending |
| Link detail | `2159:12980` | `link/link_detail_screen.dart` | Legacy UI pending migration |
| Add link | `2159:13180` | `add_link/add_link_screen.dart` | Legacy UI pending migration |
| Category list | `2159:13036` | `folder/category_screen.dart` | Legacy UI pending migration |
| Create-folder sheet | `2159:13091` | within folder flow | Pending |
| Empty folder | `2159:13158` | `folder/folder_detail_screen.dart` | Pending state |
| Folder detail list | `2159:13174` | `folder/folder_detail_screen.dart` | Legacy UI pending migration |
| Notebook detail | `2159:12842` | `notebook/notebook_detail_screen.dart` | Legacy UI pending migration |
| Notebook list | `2159:12891` | `notebook/notebook_screen.dart` | Legacy UI pending migration |
| Create notebook source choice | `2159:13626` | `notebook/create_notebook_screen.dart` | Legacy UI pending migration |
| Source selection | `2159:13570` | `notebook/select_sources_screen.dart` | Legacy UI pending migration |
| AI analysis | `2159:13602` | `notebook/notebook_analysis_screen.dart` | Legacy UI pending migration |
| Notebook content | `2159:13374` | `notebook/notebook_detail_screen.dart` | Pending state |
| AI suggestions list | `2159:13407` | `notebook/ai_suggestions_screen.dart` | Legacy UI pending migration |
| AI suggestion detail | `2159:13479` | pending | Pending |
| Search empty | `2159:13796` | `search/search_screen.dart` | Legacy UI pending migration |
| Search results | `2159:13747`, `2159:13763` | `search/search_screen.dart` | Pending variants |
| Open-link confirmation | `2159:13778` | within search flow | Pending |

## Legacy implementation reference

| Flow | Figma node | Dart screen |
| --- | --- | --- |
| Home | `2143:5988` | `home/home_screen.dart` |
| Add link | `2143:7101` | `add_link/add_link_screen.dart` |
| Category/folders | `2143:6203` | `folder/category_screen.dart` |
| Folder detail | `2143:4870` | `folder/folder_detail_screen.dart` |
| Link detail | `2143:6066` | `link/link_detail_screen.dart` |
| Notebook list | `2143:5270` | `notebook/notebook_screen.dart` |
| Choose notebook source | `2143:5058` | `notebook/create_notebook_screen.dart` |
| Select sources | `2143:4240` | `notebook/select_sources_screen.dart` |
| AI analysis | `2143:4274` | `notebook/notebook_analysis_screen.dart` |
| Notebook detail | `2143:4945` | `notebook/notebook_detail_screen.dart` |
| AI suggestion | `2143:5513` | `notebook/ai_suggestions_screen.dart` |

Primary tokens confirmed by active Home `2159:12771`: background `#F8F6FD`, primary `#7758E2`, primary soft `#F1EEFC`, ink `#0E0727`, muted `#9490A2`, neutral surface `#F5F5F7`.

Flutter token source: `lib/core/theme/figma_tokens.dart`. SVG registry/widget: `lib/widgets/figma_icon.dart`. Asset rules and naming are documented in `kit/docs/ASSETS.md`.
