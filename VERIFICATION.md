# Verification — 2026-10-10

Tested locally on Windows with Node 22.18 and isolated headless Microsoft Edge.

| Check | Result |
|---|---|
| ESLint | Passed |
| TypeScript strict type check | Passed |
| Content/security unit tests | 4 passed |
| Production static build | Passed; one published sample |
| End-to-end tests | 4 passed |
| Desktop 1440px | Search/reset, keyboard chart selection, clipboard, three repeated round trips, images and no JS errors passed |
| Mobile 360px and 390px | No horizontal page overflow; wallet selection and reduced-motion checks passed |
| No-JavaScript / deep links / 404 | Passed |
| Cover | 3200 × 1800; original locked style signature, bundled font hashes and measured text bounds passed |
| Visual review | Home, article, cover and mobile flow screenshots inspected |
| npm install audit | 0 vulnerabilities reported |

Screenshots are generated locally in `test-results/` and excluded from Git. Cover receipt: `dist/cover-validation.json`. Browser tests emulate mobile viewport sizes; physical iOS/Android devices and screen-reader software were not tested. External source destinations were retained, but not all third-party pages were reachable for link validation. GitHub Actions was triggered by the first push; consult the repository Actions tab for the latest commit result.

The first browser run encountered a sandbox launch limitation; the authorized isolated browser run succeeded. An initial desktop test used an exact link name without its visible arrow; the selector was corrected and all repeated-navigation checks passed. The final code passed the full suite after the article container markup fix.

## Asset provenance

Authorized local source: `ChainBounty-report-kit-v2.8.2-clean.zip`.
SHA-256: `30924b84f694a0b2390a03624b2d0a351ada9df3c31b72e8ece3b748990434f8`.
The kit contact-sheet pixels were inspected before adapting the site. The original logo, canonical cover module and Liberation fonts were copied unchanged. The 79AU case-specific Library package was not successfully materialized; no claim is made that its HTML or artwork was imported. The sample derives from the already-public article.

## Private repository delivery

The user completed GitHub CLI browser authentication as `waynedwkim` (ID 45944921). Stale token overrides were removed only from the invoking process. The delivery script confirmed the repository name was unused, created the personal repository [waynedwkim/chainbounty-research](https://github.com/waynedwkim/chainbounty-research) with private visibility, pushed `main`, and verified the initial remote commit exactly matched local HEAD (`34497187fa110becab298969f4b32d08ce91bdda`). Origin is `https://github.com/waynedwkim/chainbounty-research.git`. Subsequent documentation updates are ordinary commits to the same private repository. GitHub Actions runs validation only; it does not deploy.

Library resolved-file downloads were attempted with exact supplied identities and one local retry. The supported helper could not preserve required metadata on Windows (`os.setxattr` unavailable). Transfers were not bypassed. The matching authorized Downloads kit enabled independent implementation; original confidential PDFs and case review material were never imported into this repository.

No public deployment, Community edit, X publication, employer-organization repository or paid service was created.
