# Work Diagram Standard (Archify embeds)

This is the pattern for presenting work experience with Archify diagrams on the My Work page. Reuse it for each new company.

## 1. Folder layout

```
my-work.html                              # one page, one chapter per topic
assets/js/features/my-work.js             # theme toggle, embed theming, auto-height
assets/diagrams/<company>/                # published HTML (what the page embeds)
assets/diagrams/<company>/src/            # candidate.json per diagram (the source of truth)
.archify/                                 # scratch: finalize receipts, review folders (gitignore it)
```

Use a lowercase company slug, for example `hl-klemove`.

## 2. Section → diagram type

One diagram per chapter. Put it in its chapter; do not add floating "detail" sections.

| Chapter content | Type | Why |
|---|---|---|
| System under test (sensors, controllers, outputs) | `architecture` | components and trust boundaries |
| Input files and where each goes | `dataflow` | source → consumer, no fan-out |
| Pre-flight checks (several parts, one gate) | `workflow` (lanes + gate) | parallel paths converge |
| Physical wiring of a bench | `architecture` | components with real connections |
| Ordered steps | `workflow` (one lane, up to 6 steps) | steps map to columns |
| Ordered checks in phases | `workflow` with `phases` | groups become bands |
| Process with a repair loop | `workflow` with a return edge | loops stay visible |
| Status or state transitions | `lifecycle` | states, not steps |
| Review and publish with comments | `workflow` with a comment loop | approval gate and loop-back |

Do not use `timeline` or `waterfall` without real timestamps or durations.

## 3. Per-type rules learned while building

- **Schema versions:** architecture `1`, dataflow `1`, workflow `2`, lifecycle `3`, tree `1`. Wrong values fail validation.
- **Node types:** workflow and dataflow take `frontend`, `backend`, `database`, `cloud`, `security`, `messagebus`, `external`. Lifecycle states take `start`, `active`, `waiting`, `decision`, `success`, `failure`, `neutral`, `external`.
- **Workflow:** at most 6 columns (0–5). Every `mainPath` step must move forward in column order; a loop goes in an edge outside `mainPath`.
- **Workflow labels:** node labels must fit 132px. Shorten the label rather than widening the node if the validator complains.
- **Lifecycle:** the main path has a width budget (about 1,395px). Keep transition labels short ("fault value", "89 to 08").
- **Dataflow:** avoid one node fanning out to several consumers on the same channel; the labels collide. Draw one straight path per file. `channelX` did not separate routes; keep the layout simple.
- **Architecture:** components use absolute `pos` and `size`. Boundary kinds are `region` and `security-group`.
- **Tree:** set `layout.direction` to `"right"` for a wide, short tree. The default `down` is very tall in an embed.
- **Legend:** the legend can be crossed by a route in the bottom lane. If the validator reports `artifact/legend-clearance`, set `meta.legend.mode` to `"hidden"`. The valid modes are `auto`, `all` and `hidden`.
- **Preset:** use the default `classic`. The page injects the site palette, so a named preset adds styling nobody asked for.
- **Labels:** do not invent facts. Mark unknowns instead of guessing values.

## 4. Build steps (per diagram)

1. Write `candidate.json` (keep it in a `.archify/<type>-<slug>-<timestamp>/` folder).
2. Run the gates from the repo root:

   ```powershell
   node .claude/skills/archify/bin/archify.mjs finalize <type> <candidate.json> <out.html> --quality showcase --out-dir <folder>/review-2 --json
   ```

   Use a new `--out-dir review-n` on every re-run. All four gates must pass: `validate`, `deliver`, `check`, `browser-check`.
3. Check the viewBox. Width should be at least about 1.4× height; a portrait diagram crops badly in a page column.
4. Copy the HTML to `assets/diagrams/<company>/<name>.html` and the candidate to `assets/diagrams/<company>/src/<name>.candidate.json`.
5. Embed it (section 5).

If `browser-check` fails with `viewer/temp-cleanup-incomplete`, Chrome did not exit and left a temp profile. Re-run with a fresh `--out-dir`. Do not delete the reported profile unless you have confirmed you own it.

## 5. Embed snippet

Copy this block into a new chapter. Replace `<company>`, `<name>`, the title and the caption text.

```html
<!-- <Chapter title> (interactive, generated with Archify) -->
<section id="<chapter-id>" class="mw-chapter" aria-labelledby="<chapter-id>-h">
    <div class="container">
        <header class="mw-chapter-head reveal">
            <p class="section-index"><NN> — <Topic></p>
            <h2 id="<chapter-id>-h"><Heading></h2>
            <p><One-sentence lead. Do not repeat what the diagram shows.></p>
        </header>
        <figure class="mw-embed reveal" style="margin:0">
            <iframe class="mw-embed-frame" data-base="assets/diagrams/<company>/<name>.html"
                src="assets/diagrams/<company>/<name>.html?embed=1&amp;theme=dark"
                title="<Accessible description of the diagram>" loading="lazy"></iframe>
            <figcaption class="mw-embed-caption">
                <span>Interactive diagram built with Archify.</span>
                <a href="assets/diagrams/<company>/<name>.html" target="_blank" rel="noopener">Open full screen <i class="fas fa-up-right-from-square" aria-hidden="true"></i></a>
            </figcaption>
        </figure>
    </div>
</section>
```

No height classes and no JavaScript changes are needed. `my-work.js` does three things for every `.mw-embed-frame`:

- sets the frame height to the diagram's body height on load and on resize, so nothing is clipped;
- sets the Archify theme to match the site's light/dark toggle;
- injects the site palette tokens into the diagram.

Also add a nav link to the chapter in `.mw-chapters`.

## 6. Checklist before publishing

- [ ] All four Archify gates pass for every diagram.
- [ ] Each diagram sits in its own chapter, and the chapter has only a short lead.
- [ ] No floating sections, and no duplicate text list repeating the diagram.
- [ ] Each iframe's height equals its content height (no clipping, no empty space).
- [ ] No horizontal page overflow at 375px, 768px and 1280px.
- [ ] Both themes work: the toggle switches the page and every diagram.
- [ ] Every `data-base` path exists under `assets/diagrams/<company>/`.
- [ ] Candidates are saved under `src/`, and `.archify/` is not committed.

## 7. Known limits

- At phone width, dense diagrams become small. Point readers to "Open full screen".
- The "Open full screen" view keeps Archify's own palette, not the site palette.
- Lifecycle diagrams are single rows and stay small at phone width.
