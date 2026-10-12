# Editorial style

This publication uses Chicago-informed American English with the web and technical exceptions below. Chicago guides editorial decisions; it does not mandate our monochrome design, animation, or accessibility behavior. This is a house style, not a claim of full CMOS compliance.

## Copy and hierarchy

Use sentence case for headings, navigation, buttons, and figure labels. Preserve proper names, asset symbols, addresses, and source titles. Do not algorithmically change case in submitted text. Short labels omit terminal periods; prose and complete caption sentences use them. Prefer descriptive headings and action labels ("Read the investigation," "Clear filters") to slogans or vague invitations. Avoid repeated three-part fragments, promotional claims, and unnecessary modifiers.

Use American spelling, typographic quotation marks and apostrophes in editorial prose, and the serial comma where it clarifies the list. Preserve literal strings in code, transaction hashes, URLs, and quotations. Do not rewrite source quotations to enforce house style.

## Dates and quantities

Reader-facing publication dates use **October 9, 2026**, generated centrally from the ISO date; machine-readable `datetime` values retain **2026-10-09**. In a running sentence, close the year with a comma when the sentence continues: "On October 7, 2026, …". Keep original report dates distinct from activity dates and query cutoffs. Use UTC and the 24-hour clock for chain chronology (a technical house exception).

Spell out ordinary small counts in narrative when natural ("nine pulls"). Keep numerals for measured quantities, tables, figures, metrics, chain IDs, and exact values; this is an explicit technical exception to general prose number rules. Group thousands with commas in displayed quantities. Never round source values silently. `formatQuantity` retains numeric precision; values beyond JavaScript's exact numeric range must remain source strings, not bar values. Optional chart shares are derived from the displayed same-unit recipient total, rounded to one decimal place, and labeled as such. They never replace exact amounts.

Preserve approximately/≈, time boundaries, inference, unresolved ownership, and missing routes. Token quantities are not dollar losses; transfer amounts are not later balances. Do not turn selected transfers into a complete reconciliation.

## Figures and sources

Captions begin **Figure 1.**, followed by a complete description and applicable limitation. Keep units and dates near the figure. Color keys use direct role labels; color alone conveys no evidentiary status. All figures retain an accessible table or route description.

Source objects accept `publisher`, `label` (the published title), `publishedAt` (ISO), `section`, and `url`. The shared renderer presents publisher, linked title, full date, and an optional section. This is a compact linked web attribution, not a formal Chicago notes-and-bibliography citation. Copy supplied titles accurately; do not infer author names or private document URLs. Put case-specific provenance and scope in `sourceNote`, never in a shared component. The draft generator prompts editors to replace this note.

## Motion and usability

Scroll reveals are a site choice, not a Chicago rule. They change opacity/transforms only, finish promptly, and do not gate visibility. Reduced motion, absent or failed observers, and JavaScript-disabled reading retain the content. Quantity and route selection work with touch, Tab, Enter/Space, and arrow keys. Do not hide source limitations behind animation or hover-only tooltips.

## Editorial checks

Before publishing: check sentence case without altering names; verify source qualifiers and numeric precision; review chronology and source notes; inspect desktop/mobile figures; run `npm run check` and `npm run test:e2e`. Automated checks cover shared date/quantity formatting and interaction regressions, not semantic verification or a claim of CMOS compliance.

References consulted:

- [Chicago Q&A: serial comma](https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Commas/faq0042.html).
- [Chicago Q&A: judgment and flexibility](https://www.chicagomanualofstyle.org/qanda/data/faq/topics/Commas/faq0077.html).
- [Chicago 18th edition terminology: title case and sentence case](https://www.chicagomanualofstyle.org/help-tools/what-s-new.html).
- [Chicago citation quick guide](https://www.chicagomanualofstyle.org/tools_citationguide.html).
