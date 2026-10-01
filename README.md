# officehq-angular-officefloor — base repository (Angular SPA + OfficeFloor)

A **base repository** for the `ui-long-degradation-test` harness — **one technology stack**:
front-end **Angular** SPA (v21, standalone components, lazy routes), backend **OfficeFloor**
(within Spring) on in-memory H2.

This is the **framework control** for the front-end comparison. `~/officehq-react-officefloor`
(mutative React), `~/officehq-tanstack-officefloor` (additive React) and
`~/officehq-htmx-officefloor` (no client at all) all vary the *architecture*; this one varies the
*framework* and holds everything else — backend, tests, checkpoints and the agent's rules —
constant. It exists to answer the sharpest objection to a React-vs-React result: that a page
component bloating is a property of the agent rather than of the framework. Angular makes that
harder (one component per file, DI instead of prop-drilling, routing declared as config), so if its
routed components still bloat the finding generalises; if they do not, the finding becomes
"framework conventions do the work" — equally worth reporting.

`CLAUDE.md` deliberately states the **same rules** as the React arm, in Angular's idiom, so the
framework is the only variable. A page is a new standalone component plus ONE lazy entry in
`app.routes.ts`; that entry's `data: { section, label }` supplies its nav link, because the shell
reads the router's own config rather than holding a list of pages. It is the
near-empty starting point (base shell + Spring/OfficeFloor + empty H2, no tables) that the harness
**evolves** into a full application over ~60 English change requests, one full-stack change per
checkpoint.

- Base repos are **home-level sibling directories**, one per stack, named
  `~/officehq-<frontend>-<backend>` so both layers are visible (`~/officehq-react-officefloor`,
  `~/officehq-<frontend>-<backend>`, …) — the **front-end and the backend may both vary** between
  stacks. The study compares stacks by running the harness against each in turn — which stack best
  resists erosion.
- The harness (`~/ui-long-degradation-test`, `config.yaml → app.repo`) reads this folder at branch
  **`base-empty`**, worktrees it onto `evolve/<run_id>/<condition>/chain<n>`, and commits each
  checkpoint there. This branch is only ever read.
- It honours the **App contract** — see `~/ui-long-degradation-test/docs/SUT_CONTRACT.md`.
- **Try another stack:** create a new sibling `~/officehq-<frontend>-<backend>` (different
  front-end, different backend, or both), satisfy the same `BASE_CHECKLIST.md`, and point
  `app.repo` at it. Each is its own run.

**Status: green.** `ng build` emits straight into `src/main/resources/static`, `bin/build`
produces the one jar, and `bin/e2e` verified against the real jar that the shell renders with its
nav built from the router config and that a deep link survives a refresh through `SpaConfig`. Node
is pinned to **v22.12.0** (Angular 21's CLI rejects the v20.11.1 the React arms use) and is cached
in `~/.m2` after the first build, so the Landlock-confined gate needs no network.
