# officehq-app — base repository (SUT)

A **base repository** for the `ui-long-degradation-test` harness: the near-empty starting point
(base front-end shell + Spring-with-OfficeFloor plugin + empty in-memory H2, no tables) that the
harness **evolves** into a full application over ~60 English change requests, one full-stack change
per checkpoint.

- The harness (`~/ui-long-degradation-test`, `config.yaml → app.repo`) reads this folder at branch
  **`base-empty`**, worktrees it onto `evolve/<run_id>/<condition>/chain<n>`, and commits each
  checkpoint there. This branch is only ever read.
- It honours the **App contract** — see `~/ui-long-degradation-test/docs/SUT_CONTRACT.md`.
- **Swap the tech:** copy this folder to `~/compare/officehq-app-<other-tech>`, satisfy the same
  `BASE_CHECKLIST.md` with a different stack, and point `app.repo` at it. Each base repo is tried
  as its own run.

**Status: skeleton.** Every file is a stub with `TODO` markers. Work through
**[BASE_CHECKLIST.md](./BASE_CHECKLIST.md)** to make it runnable, then smoke-test (checklist §H).
