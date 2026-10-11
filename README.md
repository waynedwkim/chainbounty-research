# ChainBounty Research

Static-first interactive research publication. Structured article JSON automatically applies the reusable layout, locked ChainBounty cover, figures, sources and case-specific CTA. No public deployment is configured.

## Run locally (Windows)

Requires Node.js 22+ and Microsoft Edge.

```powershell
npm ci
npm run build
npm run preview
```

Open **http://127.0.0.1:4173**. `npm run dev` rebuilds when content/templates change; reload the browser after a successful rebuild. The preview binds only to localhost.

On Linux or a machine without Edge, install a Playwright browser and use the Chromium channel:

```sh
npx playwright install chromium
BROWSER_CHANNEL=chromium npm run build
BROWSER_CHANNEL=chromium npm run test:e2e
```

## Add an investigation

1. Run `npm run new:article -- your-case-slug`. This creates a **draft**, without overwriting existing files.
2. Edit `content/articles/your-case-slug.json`. Replace all metadata, cover text, figures, links, sources and CTA with approved material. Use the 79AU sample to see the block shapes.
3. Keep `status: "draft"` during preparation. Drafts are validated but excluded from generated HTML, navigation and assets.
4. Set `status: "published"` only after editorial approval. Run `npm run check` and `npm run test:e2e`, inspect the desktop/mobile results, and review the generated pages locally.
5. Commit the content and approved assets to the private repository. `npm run build` produces portable static files in `dist/`; public hosting is a separate, explicitly authorized step.

The import boundary is **reviewed structured content**, not arbitrary PDF parsing. This is not a production CMS, authentication system, wallet connector, or live blockchain indexer. A private GitHub repository does not make a separately hosted site private. `noindex` and robots exclusions are crawl preferences, not access control.

## Content contract

See [EDITORIAL.md](EDITORIAL.md) for the Chicago-informed house style, technical exceptions, source-note format, and motion/accessibility rules. Shared dates, exact numeric display, reading times, and action labels live in `src/editorial.ts`; components apply them to every article. Add a case-specific `sourceNote` to each article. Source records may also provide `publisher`, `publishedAt`, and `section` for consistent linked attribution.

`src/schema.ts` is the authoritative Zod schema and inferred TypeScript contract. Every JSON file is parsed at build time. Unknown fields, invalid dates, negative chart values, unsafe source URL protocols, duplicate slugs/section IDs and missing flow endpoints fail the build.

- `prose`: `id`, `title`, `paragraphs[]`.
- `bars`: `id`, `title`, `unit`, `rows[{label,value,detail,tone}]`, `caption`, `note`, `source`.
- `flow`: `id`, `title`, `context` (date and unit label), `nodes[{id,label,role,detail,url?,tone}]`, `edges[{from,to,label,kind}]`, `caption`, `note`, `source`.
- `conclusion`: `id`, `title`, `paragraphs[]`, `takeaways[]`.
- Figure tones: `slate`, `sage`, `amber`. Edge kinds: `observed`, `reported`. Use the note to make the provenance explicit; observed here does not mean independently verified by this site.
- Keep numeric strings in route labels exact. Bar values must share the declared unit. Do not treat token counts as dollar loss, transfer amounts as later balances, or selected routes as a full reconciliation.
- Text is escaped, never executed as raw HTML. Only HTTPS external source/CTA links are accepted.

## Template and source separation

- `templates/cover/`: unchanged v2.8.2 canonical cover generator, logo embed and font fingerprint specification.
- `public/assets/`: original kit monochrome logo and unmodified licensed Liberation fonts.
- `src/render.ts`, `src/site.css`, `src/client.ts`: reusable site, article and interactive figure components.
- `content/articles/`: case-specific public editorial content, separate from reusable templates.
- `scripts/build.ts`: static HTML generation, font SHA-256 verification, cover signature verification, measured text-bounds validation and 3200 × 1800 PNG export.

Cover geometry is inherited from the locked Base-reference portable family: sentence-case “Investigation analysis”, original logo geometry, bold Liberation Serif headline, two subtitle lines at most, generous margins, fixed date placement and no divider. These licensed fonts are not pixel-identical to Georgia/Segoe UI. Overflow fails the build; shorten cover text rather than shrinking fonts.

## Accessibility and interactions

Native buttons work with Tab, Enter and Space. Selected chart rows/wallets update a polite live region and expose `aria-pressed`. Exact values and source notes are visible independently of color. Figures include native tables or expanded route descriptions; core article text and disclosures work without JavaScript. Reduced-motion preferences disable smooth scrolling. The copy buttons report clipboard failures with a manual fallback.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright tests use an isolated headless Edge context, never the user's existing tabs. They cover search/reset, keyboard selection, clipboard, repeated home/article navigation, deep routes, 404, no-JavaScript reading, image loading, reduced motion and horizontal overflow at 360px and 390px. Screenshots appear in `test-results/`. Cover receipts appear in `dist/cover-validation.json`.

## Content provenance and exclusions

Additional interaction checks cover optional recipient shares, selectable flow edges, arrow-key navigation, back/forward history, unchanged document height during scrolling, and missing/failed observers. One test records a short WebM in `test-results/interaction-recording/`; on an Edge-only Windows installation, first run `npx playwright install ffmpeg`. The runtime uses no animation library or external data requests. Scroll entrances use opacity/transforms and respect reduced motion; unobserved content is visible by default.

Sample: [published 79AU article](https://community.chainbounty.io/ko/posts/01a11f85-62b6-7009-b7a1-2580b34c78de), October 9, 2026. This is a concise interactive reading edition, not a claim to reproduce the full report. The original SentinelTX PDF, private investigation metadata and review notes are not included. Figures describe the public article's historical snapshot, not current balances. No identity attribution is added.

Reusable assets were recovered from the user-authorized local `ChainBounty-report-kit-v2.8.2-clean.zip`. The Library transfer route could not complete Windows metadata preservation, so no Library ZIP was installed through a bypass. The separate case package could not be read here; its HTML/artwork is not claimed as reused.

Font license: `public/assets/fonts/LICENSE.txt` (SIL Open Font License). ChainBounty logo remains the supplied brand asset; no additional trademark rights or broad source-code license are asserted.

## Private GitHub handoff

See `scripts/push-private.ps1`. It verifies the authenticated user is exactly `waynedwkim`, refuses to reuse an existing repository, creates only a **private personal** repository, pushes `main`, and verifies remote commit and visibility. It never deploys the site. If `GH_TOKEN` is invalid, reauthenticate the GitHub CLI locally; do not paste tokens into source files or chat.
