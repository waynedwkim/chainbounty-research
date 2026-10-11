# Editorial and interaction review

## Scope

Chicago-informed house copy and a more deliberate research-publication interface. The locked cover, original logo, fonts, amounts, addresses, source caveats, and public-source boundary remain intact. No Community/X post is edited. This branch is for review, not public deployment.

| Before | After |
|---|---|
| Follow the funds. Understand the story. | Blockchain investigations. Evidence in context. |
| Explore the investigation | Read the investigation |
| Reset | Clear filters |
| 2026-10-09 / 4 min read | October 9, 2026 / 4-minute read |
| Sources & scope | Sources and scope |
| Generic reading-edition source text in the renderer | Required case-specific source note and shared linked attribution format |

The interface adds a quieter monochrome frame, stronger section hierarchy, a persistent desktop navigation bar, and clearer chart controls. Short scroll entrances animate sections, bar lengths, and flow direction. Exact token values remain visible when the optional derived percentages are enabled. Wallets and transfer arrows are selectable by touch, pointer, or keyboard; arrow keys move within each figure.

## Evidence

Screenshots and the interaction recording below are local test captures, not a public deployment. The before images are from the previously validated main-branch design; the after images show this branch. Mobile screenshots are viewport emulation, not a physical iPhone test.

| Desktop before | Desktop after |
|---|---|
| ![Previous homepage](docs/review/before-desktop.png) | ![Updated homepage](docs/review/after-desktop.png) |

| Mobile before | Mobile after |
|---|---|
| ![Previous article at 390px](docs/review/before-mobile.png) | ![Updated article at 390px](docs/review/after-mobile.png) |

[Mobile fund-flow detail](docs/review/after-flow.png) · [Short interaction recording (WebM)](docs/review/interaction.webm)

## Verification

- Lint, strict TypeScript, seven unit tests, and the production build pass locally.
- Browser checks cover desktop, 360/390px layouts, keyboard activation, three repeated navigation cycles, clipboard, deep routes, 404, and JavaScript-disabled reading.
- Additional checks cover derived shares, selectable routes, arrow-key focus, back/forward history, reduced motion, missing/throwing observers, and unchanged document height during scrolling.
- A 320px touch test exercises chart controls and wallet selection without page overflow. The minified browser runtime is 4,610 bytes, below the 8 KB test budget; no animation dependency was added.
- A public-source fixture protects exact amounts, metric values, flow nodes/addresses/details, route labels, captions/limitations, conclusion qualifications, CTA seed prompt, and locked cover text.
- Generated cover font hashes, style fingerprint, and measured text bounds pass. Template/font/logo source files have no changes.

This is not a comprehensive accessibility certification or a lab performance score. Physical iOS, screen-reader software, and network-throttled field performance were not tested. Motion uses layout-preserving transforms/opacity and never hides content while waiting for an observer. See the PR checks for the final remote CI result.

Local preview on the Windows desktop: `http://127.0.0.1:4173/`. This address is not reachable from the user's phone. Review images and the recording in this private repository while signed in to GitHub.
