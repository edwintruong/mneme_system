# How to check the build against Figma

Two things are worth checking separately: that the app runs the way Google AI
Studio will run it, and that each screen matches its Figma node.

## 1. Run it the way the deployment does

Google AI Studio deploys to Cloud Run, which builds the Vite project and starts
the Node server with a `PORT` it assigns.

```bash
npm install
npm run build
PORT=8080 npm start
```

Then open <http://localhost:8080>. `npm run dev` also works and gives hot
reload, but it runs Vite's dev middleware, so it does not exercise the same path
the deployment takes — use `npm start` when you want to check the deploy.

Two sanity checks:

```bash
curl -s localhost:8080/api/health          # {"status":"ok","geminiConfigured":…}
curl -o /dev/null -w '%{http_code}\n' \
  localhost:8080/assets/icons/figma_2159/2159_12771_nav_bg.svg   # 200
```

`geminiConfigured` is `false` until `GEMINI_API_KEY` is set. AI Studio sets it
as a server-side secret; locally, copy `.env.example` to `.env` and fill it in.

### Docker on port 1300

The checked-in image uses a build stage with all Vite tooling and a smaller
runtime stage with production dependencies only:

```bash
docker build -t mneme-system:port-1300 .
docker run --rm --name mneme-port-1300 \
  -p 127.0.0.1:1300:1300 -e PORT=1300 \
  mneme-system:port-1300
curl -fsS http://127.0.0.1:1300/api/health
```

The localhost bind deliberately avoids exposing the showcase to the network.
Pass `-e GEMINI_API_KEY` at runtime only when real Gemini calls are required;
never copy a local `.env` into the image. The built-in Docker health check uses
`/api/health` and should report `healthy` after startup.

## 2. Compare each screen against its Figma export

```bash
pip install pillow playwright && playwright install chromium
python3 kit/scripts/figma_compare.py
```

The script screenshots the running app at each node's frame size, diffs it
against the export committed in `kit/figma-refs/`, and prints:

```
node          screen          mean abs diff / 255      pixels >28  note
2159:12771    Home             3.10 /  3.13 /  3.06        3.80%
2159:12891    Notebook list    4.40 /  4.57 /  3.23        4.78%
```

It also writes `kit/figma-refs/out/compare_*.png` — one image per screen, laid
out as **Figma | app | difference mask**. The mask is the honest view: white
pixels are where the two disagree. Structural mistakes show up as solid white
blocks; correct work shows only thin outlines around glyph edges.

### Reading the number

Mean absolute difference per channel, out of 255, over the whole frame.

- **Under ~5** — the layout matches. What is left is text antialiasing (Chrome
  renders subpixel, Figma renders grayscale) and JPEG re-encoding in photos.
  Neither can be removed, and neither is a design difference.
- **Above ~8** — something is structurally wrong: an element in the wrong place,
  a missing asset, a wrong colour. Open the compare PNG and look at the mask.

A low number alone does not prove much on a mostly-white screen, which is why
the mask image matters more than the number. When a screen is rebuilt, the
element bounding boxes are also checked individually against the export —
avatar, icons, image rails, buttons, nav labels — and are expected to land
within 1px.

### Why the corners are excluded

Figma exports the artboard with a 40px corner radius, so the canvas backdrop
(`#444444`) and its antialiased ring show through the four corners. The web
build is square at phone width, because a deployed web app should not clip its
own content. Those corner wedges are excluded from the numbers rather than
worked around in CSS.

## 3. What is not covered yet

`kit/figma-refs/` only holds exports for the screens rebuilt so far. The rest of
the screens listed in `FIGMA_MAP.md` are still the pre-rebuild interpretation
and are not in the comparison table. Adding a screen means exporting its node
into `kit/figma-refs/` and adding a row to `SCREENS` in the script.

There are no Figma nodes for the Activity and Profile tabs in section
`2159:12770`, so those two screens have no design to match.
