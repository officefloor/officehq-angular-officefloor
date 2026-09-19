# officehq-react — base repository (React SPA stack)

A **base repository** for the `ui-long-degradation-test` harness — **one technology stack** (React
SPA on Spring-with-OfficeFloor + in-memory H2). It is the near-empty starting point (base front-end
shell + Spring/OfficeFloor + empty H2, no tables) that the harness **evolves** into a full
application over ~60 English change requests, one full-stack change per checkpoint.

- Base repos are **home-level sibling directories**, one per stack (`~/officehq-react`,
  `~/officehq-<other>`, …). The study compares stacks by running the harness against each in turn —
  which technology stack best resists erosion.
- The harness (`~/ui-long-degradation-test`, `config.yaml → app.repo`) reads this folder at branch
  **`base-empty`**, worktrees it onto `evolve/<run_id>/<condition>/chain<n>`, and commits each
  checkpoint there. This branch is only ever read.
- It honours the **App contract** — see `~/ui-long-degradation-test/docs/SUT_CONTRACT.md`.
- **Try another stack:** create a new sibling `~/officehq-<other>`, satisfy the same
  `BASE_CHECKLIST.md` with a different stack, and point `app.repo` at it. Each is its own run.

**Status: skeleton.** Every file is a stub with `TODO` markers. Work through
**[BASE_CHECKLIST.md](./BASE_CHECKLIST.md)** to make it runnable, then smoke-test (checklist §H).
