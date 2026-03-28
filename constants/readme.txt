ReadySetHire Constants Manifesto
==================================

I rebuilt this module to be the single source of truth for every UX-critical literal that powers ReadySetHire’s Vue 3 + TypeScript revolution. Backed by Vite, Vue Router, Pinia, and our evergreen design system, `ReadySetHire/constants/index.ts` now lets any consumer instantly compose delightful UI, deterministic data flows, and referentially transparent analytics.

Tech Stack Alignment
--------------------

- **Vue 3 Composition API**: constants plug straight into `<script setup>` blocks with zero ceremony.
- **TypeScript**: strong typing is enforced at compile time, so consumers get IntelliSense and exhaustiveness checks.
- **Vue Router**: every route declared here mirrors the router map, preventing 404s before they happen.
- **Pinia Stores & Composables**: functional modules import these constants once, hydrate reactive state, and enjoy tree-shakable purity.
- **Vite + ESBuild bundling**: dead-code elimination keeps payloads lean even with massive dictionaries like `slugs`.

Exports At A Glance
-------------------

| Constant | What It Fuels | Why It’s Revolutionary |
|----------|----------------|------------------------|
| `sidebarLinks` | Navigation rails, drawers, command palettes | Centralized IA ensures design/dev parity across every screen size |
| `avatarImages` | Participant carousels, fallback profile chips, skeleton states | Deterministic visual identity even when users skip uploads |
| `resources` | Learning hubs, onboarding tours, in-app nudges | Codifies proprietary knowledge into reusable growth levers |
| `slugs` | Coding challenge routing, caching, analytics | Makes 900+ LeetCode-style mappings instantly accessible anywhere |

`sidebarLinks`
--------------

```ts
export const sidebarLinks = [
  { label: 'Home', route: '/home', imageUrl: '/icons/Home.svg' },
  // more routes crafted for momentum
];
```

- **Narrative Design**: Every entry is story-crafted—label, route, and icon join forces to keep candidates oriented throughout complex interview prep flows.
- **Router Sync**: Routes align 1:1 with `createRouter` records, so guards, breadcrumbs, and deep links never drift.
- **Design System Hooks**: Icons reference our `/public/icons` sprite sheet, meaning theming engines and dark mode automatically inherit updates.
- **Extension Playbook**:
  1. Draft the route in Vue Router.
  2. Craft an accessible label (title case, <20 chars).
  3. Drop a 24×24 SVG (stroke-based, monochrome) into `/public/icons`.
  4. Append to `sidebarLinks`—order defines IA priority.

`avatarImages`
--------------

```ts
export const avatarImages = [
  '/images/avatar-1.jpeg',
  // cinematic headshots continue...
];
```

- **Pixel-Perfect Library**: Curated, color-balanced portraits ensure every mock call, lobby preview, and roster snapshot feels premium.
- **No-Network Guarantee**: Assets bundle with the app, so even low-connectivity interviews retain polish.
- **Probabilistic Delight**: Components can `Math.random` or `index % length` these paths to maintain diversity without introducing stateful side effects.
- **Scaling Rules**: Keep files ≤150 KB, square aspect, and sequential naming so prefetch scripts and CDN invalidation stay predictable.

`resources`
-----------

```ts
export const resources: { title: string; href: string; description: string }[] = [
  { title: 'Consulting Material', href: 'https://drive.google.com/...', description: 'Resources you may need...' },
  // curated arsenal continues
];
```

- **Growth Engine**: This array is our content ops pipeline—each entry unlocks a new knowledge lane (DSA, DBMS, OS, OOPS, projects, and beyond).
- **UX Ready**: Titles fit CTA buttons, descriptions stay under 160 characters for meta tags, and `href` targets are HTTPS-only for CSP compliance.
- **Analytics Friendly**: Feed IDs derived from titles into Pinia stores or Segment trackers to know exactly which PDFs drive conversions.
- **Caretaker Checklist**:
  - Verify Drive links are public before merging (curl `-I` to confirm 200s).
  - Prefer evergreen docs; mark sunset dates in issue tracker when applicable.
  - Localize descriptions up front if the feature crosses locales.

`slugs`
-------

```ts
export const slugs: { [key: string]: string } = {
  "1": "two-sum",
  "2": "add-two-numbers",
  // ...through hundreds of elite challenges
};
```

- **Problem Genome**: 900+ LeetCode-style IDs instantly resolve to kebab-case slugs, letting us mint URLs like `/questions/longest-palindromic-substring` without manual mapping.
- **Zero-Latency Lookup**: Plain object lookups mean no async fetch, no DB hit, just instant access inside any runtime (browser, Node, SSR).
- **Consistency Contracts**:
  - Keys stay stringified to avoid `Object.keys` surprises.
  - Values stay kebab-case, ASCII-only, slug-safe.
  - Entries remain sorted numerically so Git diffs stay human-readable.
- **Operational Tips**: For bulk ingestion, script updates via Node, then run a JSON schema or custom ESLint rule to catch duplicates before PR review.

Integration Power Moves
-----------------------

- **Freeze What Ships**: `Object.freeze` or `as const` boosts type inference and prevents rogue mutations in shared stores.
- **Tree-Shake Wisely**: Import only what you need (`const { sidebarLinks } = await import(...)`) inside route-level code splitting to minimize bundle weight.
- **Testing Brilliance**: Snapshot tests should mock modules at the constant boundary so UI diffs highlight intention, not data churn.
- **Analytics Alignment**: Derive consistent event names (e.g., `NAV_CLICK_${label.toUpperCase()}`) straight from these constants to keep dashboards and code in sync.

Evolution Checklist
-------------------

1. **Schema Fidelity**: Honor the documented TypeScript shapes; if a change needs more structure, graduate to dedicated interfaces exported alongside the data.
2. **Asset Reality**: Confirm every `imageUrl` and `avatarImages` path exists in `/public` (Vite dev server will hot reload, but CI should never discover missing files).
3. **Link Integrity**: Automate HEAD checks for every `resources.href` during CI to catch expired Drive tokens proactively.
4. **Slug Stewardship**: Treat the slug map as infrastructure—script inserts, lint duplicates, and document provenance so downstream knowledge graphs stay healthy.

With this manifesto, the constants module stops being a static afterthought and becomes the beating heart of ReadySetHire’s revolutionary candidate journey. Anything that needs to feel intentional, on-brand, and future-proof should anchor itself to these exports.
