# Base-repo checklist

This is a **base repository** for `ui-long-degradation-test` (see that repo's `DESIGN.md` and
`docs/SUT_CONTRACT.md`). The harness points `config.yaml → app.repo` at this folder, worktrees the
`base-empty` branch onto a fresh `evolve/<run_id>/<condition>/chain<n>` branch, and evolves it —
one full-stack English change request per checkpoint — committing each checkpoint on that run
branch. The base branch is only ever read.

**This folder is a skeleton: every item below is a stub with `TODO` markers.** Fill them in to get
a runnable base. Because the harness only depends on the *contract* (not the tech), you can copy
this folder to `~/compare/officehq-app-<other-tech>`, satisfy the same checklist with a different
stack, and point `app.repo` at it — that is how "different base repositories with different
technologies" are tried, one run each.

---

## A. The base must start NEAR-EMPTY

- [ ] **No domain tables.** `src/main/resources/db/migration/` has no Flyway migrations that create
      domain tables (a baseline `V0__baseline.sql` for extensions/`__test__` support only is fine).
      cp01 creates the first real tables.
- [ ] **No domain features.** The front-end is a bare shell (nav frame + empty home), the backend
      has no domain endpoints. The app **builds, boots, and serves an empty shell** as-is.
- [ ] **It is green before cp01.** `bin/build` succeeds and `bin/start` serves `/actuator/health`
      = UP and the shell renders, from a clean checkout of `base-empty`.

## B. One embedded stack (DESIGN.md §14, §15 — must run under Landlock)

- [ ] **Single JVM, no daemon/container.** Spring Boot app; OfficeFloor within Spring as a plugin.
- [ ] **In-memory H2** (`jdbc:h2:mem:app;DB_CLOSE_DELAY=-1`), auto-configured; dies with the JVM.
- [ ] **Flyway** runs migrations on boot to build the schema up from empty.
- [ ] **SPA served as static files** from `src/main/resources/static` with an SPA deep-link
      fallback (unknown non-`api/` path → `index.html`). `src/main/frontend` builds into `static/`.
- [ ] **Spring Actuator** health at `/actuator/health` (the harness readiness probe).
- [ ] No external services, no network egress needed to build/boot (toolchain resolvable offline
      or pre-warmed — the agent turn is Landlock-confined).

## C. Fixed operational scaffolding (PINNED — agent runs but never edits; DESIGN.md §15)

These commands must stay constant across checkpoints even as the app evolves. They are in
`config.yaml → isolation.pin_files` and restored to authored before every gate.

- [ ] `bin/build` — compile backend + front-end into one runnable jar (SPA baked into `static/`).
- [ ] `bin/start` — `java -jar <the built jar> --server.port=$PORT`; exits 0 once launching.
- [ ] `bin/stop` — kill the JVM / free `$PORT`; **idempotent** (safe when nothing runs / after a
      crash). The harness may also kill by port.
- [ ] `bin/e2e` — build + start + run **only the specs currently present** in `e2e/specs` +
      stop. This is what the agent runs to test as it works (it only ever sees its own spec).
- [ ] All four are executable (`chmod +x`) and depend only on `$PORT` (+ their own internals).

## D. The test contract (DESIGN.md §3, §9)

- [ ] **`data-test-id` everywhere behaviour is observed.** The shell and every feature expose
      stable `data-test-id` anchors; nothing the tests rely on uses CSS/DOM/text.
- [ ] **`data-test-id` is immutable public API** — once introduced, never renamed/removed. State
      this rule in `CLAUDE.md`/`AGENTS.md` (pinned) so every agent turn obeys it.
- [ ] **`/__test__` seed endpoint** (profile-guarded: only active under the harness's launch
      profile). `POST /__test__/reset` (truncate all domain tables) + `POST /__test__/seed`
      (insert a fixture payload). This is **app code and evolves** with the schema (NOT pinned); a
      change that breaks a prior spec's seed is a *seed-path* regression (DESIGN.md §6).
- [ ] **Playwright project** in `e2e/` (`playwright.config.ts`, `package.json`) with `baseURL` =
      `http://localhost:$PORT` and strict awaiting on `data-test-id`. The harness copies authored
      `cpNN` specs into `e2e/specs/` (`config.yaml → acceptance.dest_subpath`); do not commit specs
      to the base.
- [ ] A shared `e2e/support/` with a `beforeEach` reset+seed helper the specs call.

## E. Agent-facing instructions (PINNED)

- [ ] `CLAUDE.md` (and `AGENTS.md`) tell the agent: it is making a **full-stack** change
      (migration + OfficeFloor server + front-end) from a plain-English request; the `data-test-id`
      immutability rule; that it can run `bin/e2e` to test; the additive/opinionated conventions of
      the shell (routing, no global store, closed primitives, slice boundaries, scoped styles).
- [ ] These never leak the checkpoint sequence (no cpNN references, no prior-request hints).

## F. Layout the harness expects (matches `config.yaml`)

```
bin/{build,start,stop,e2e}                      # pinned scaffolding (C)
src/main/java/**/*.java                          # backend (source_globs.backend)
src/main/resources/application.properties        # H2 + Flyway + actuator + SPA static
src/main/resources/db/migration/                 # Flyway migrations (empty at base)
src/main/resources/officefloor/                  # OfficeFloor wiring (shared_surfaces.backend)
src/main/resources/static/                        # SPA build output (served)
src/main/frontend/**/*.{ts,tsx}                  # front-end (source_globs.frontend)
src/main/frontend/{router,ui}/                    # shared_surfaces.frontend
e2e/{playwright.config.ts,package.json,support/} # Playwright project (specs copied in per cp)
CLAUDE.md, AGENTS.md                              # pinned agent instructions
pom.xml (or build.gradle)                         # one build producing the runnable jar
```

- [ ] `config.yaml → app.source_globs` / `shared_surfaces` match the real paths (so per-layer
      erosion and boundary-violation counts are correct — DESIGN.md §8).

## G. Git

- [ ] The base state lives on branch **`base-empty`** (= `config.yaml → app.base_ref`).
- [ ] `.gitignore` excludes build output (`target/`, `node_modules/`, `src/main/resources/static/*`
      if generated, `*.jar`) so the agent's committed delta is source only.
- [ ] Local repo is enough (the harness reads it by path); a remote is optional.

## H. Smoke test before wiring into a run

- [ ] From a clean `base-empty` checkout: `bin/build` → `bin/start` → `curl /actuator/health` = UP
      → shell renders → `bin/stop` frees the port.
- [ ] Drop one throwaway spec into `e2e/specs/` and confirm `bin/e2e` builds, serves, runs it, and
      stops — the whole agent-test loop end to end.
- [ ] Confirm the whole thing runs under the harness's Landlock allowlist
      (`python harness/landlock_selftest.py` in the harness repo; add toolchain binds in
      `config.yaml → isolation` as needed).
