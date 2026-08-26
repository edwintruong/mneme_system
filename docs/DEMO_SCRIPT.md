# Mneme video demo script mapping

This implementation map is based on the original supplied 0:00–1:05 script.

| Time | Story beat | App route / action | On-screen message |
| --- | --- | --- | --- |
| 0:00–0:06 | Hook: repeatedly save across social apps | Film TikTok/Facebook/Instagram externally | `Đã lưu: 47 → 89 → 132` |
| 0:06–0:15 | Agitate: saved content becomes impossible to recover | Film external saved lists/bookmarks/notes | `Lưu thì dễ. Tìm lại — không dễ chút nào.` |
| 0:15–0:20 | Reveal Mneme | In Android's share sheet, choose Mneme; the shared URL pre-fills the intake screen | Mneme logo reveal |
| 0:20–0:38 | AI reads and organizes a shared link | Add link → save → `LinkAnalysisScreen` → Home/Category | `Share vào → AI tự sắp xếp` |
| 0:38–0:48 | Natural-language retrieval | Home search → type `video làm bánh bằng nồi chiên không dầu` | `Không nhớ tên. Vẫn tìm ra.` |
| 0:48–0:58 | Turn related saves into knowledge | Home AI notebook CTA → select sources → analysis → notebook detail | `Từ link rời rạc → thành sổ tay tri thức` |
| 0:58–1:05 | Close | Film clean logo/title card externally | `Mneme — Lưu · Phân loại · Biến thành tri thức` |

## Live app sequence

1. From TikTok/Chrome/another Android app, share a text URL to Mneme. Confirm the pre-filled URL, AI-recommended Design category, and UI/UX folder, then save. The center `+` remains the fallback intake path.
2. Let the five link-analysis steps complete. Open Design to show the persisted classified card and editable tags/folder.
3. Search the exact fuzzy phrase `video làm bánh bằng nồi chiên không dầu`; the seeded TikTok recipe appears even though the user did not enter its exact title or source.
4. Tap the purple notebook suggestion on Home. Select at least two links, continue, wait for AI analysis, expand the generated contents, and open AI suggestions from Activity.

## Technology segment

The showcase intentionally uses SQLite and no authentication, so it is reliable offline. Android text sharing is implemented natively through `ACTION_SEND` and a Flutter method channel. For a production architecture, the script's proposed mapping remains: Firebase Auth for identity, Cloud Firestore for link/category/folder/tag/notebook metadata, Cloud Functions for metadata ingestion and status updates, and Firebase AI Logic with Gemini for category/folder/tag recommendations. This future architecture is not enabled in the local demo build.

To trigger the share flow from ADB during rehearsal:

```bash
adb shell am start -a android.intent.action.SEND -t text/plain --es android.intent.extra.TEXT "https://www.youtube.com/watch?v=design-system" com.mneme.demo.mneme
```
