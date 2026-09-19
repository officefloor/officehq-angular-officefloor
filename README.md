# officehq-react-officefloor — base repository (React SPA + OfficeFloor)

A **base repository** for the `ui-long-degradation-test` harness — **one technology stack**:
front-end **React** SPA, backend **OfficeFloor** (within Spring) on in-memory H2. It is the
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

**Status: skeleton.** Every file is a stub with `TODO` markers. Work through
**[BASE_CHECKLIST.md](./BASE_CHECKLIST.md)** to make it runnable, then smoke-test (checklist §H).
