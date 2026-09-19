# Base-repo checklist

This is a **base repository** for `ui-long-degradation-test` (see that repo's `DESIGN.md` and
`docs/SUT_CONTRACT.md`). The harness points `config.yaml → app.repo` at this folder, worktrees the
`base-empty` branch onto a fresh `evolve/<run_id>/<condition>/chain<n>` branch, and evolves it —
one full-stack English change request per checkpoint — committing each checkpoint on that run
branch. The base branch is only ever read.

This stack is **React (front-end) + OfficeFloor (backend)** on in-memory H2 — hence the name
`officehq-react-officefloor`.

**This folder is a skeleton: every item below is a stub with `TODO` markers.** Fill them in to get
a runnable base. Because the harness only depends on the *contract* (not the tech), you create a
new stack as a **home-level sibling** `~/officehq-<frontend>-<backend>` (name both layers, since
either may vary), satisfy the same checklist with a different technology, and point `app.repo` at
it — that is how different technology stacks are compared, one run each, to see which resists
erosion best. §B below is written for this WoOF/OfficeFloor/H2 stack; a different-backend sibling
adapts §B's specifics but must keep the same *properties*: one embedded JVM (no daemon/container),
schema migrated on boot, a static-served SPA, a `/health` readiness route, and the `/__test__` seed
endpoint.

---

## A. The base must start NEAR-EMPTY

- [ ] **No domain tables.** `src/main/resources/db/migration/` has no Flyway migrations at base
      (empty dir with `.gitkeep`). cp01 adds `V1__*.sql` creating the first real tables.
- [ ] **No domain features.** The front-end is a bare shell (empty home), the backend has only the
      `/health` and `/__test__` routes. The app **builds, boots, and serves the shell** as-is.
- [ ] **It is green before cp01.** `bin/build` succeeds and `bin/start` serves `/health` = UP and
      the shell renders, from a clean checkout of `base-empty`.

## B. One embedded stack (DESIGN.md §14, §15 — must run under Landlock)

- [ ] **Single JVM, no daemon/container.** WoOF (OfficeFloor) is the HTTP server; Spring is
      supplied into it (`officespring_webmvc`, `officefloor/suppliers/Spring.yml`). Executable jar
      built by `spring-boot-maven-plugin` with main class `net.officefloor.OfficeFloorMain`.
- [ ] **In-memory H2** via OfficeFloor's `officejdbc_h2` — `officefloor/objects/DataSource.yml`
      (`jdbc:h2:mem:officehq;DB_CLOSE_DELAY=-1`); dies with the JVM.
- [ ] **Flyway on boot** via OfficeFloor's `officeflyway_migrate`, from `src/main/resources/db/
      migration` — builds the schema up from empty.
- [ ] **SPA served from `src/main/resources/PUBLIC`** (WoOF serves static content from `PUBLIC/`).
      `src/main/frontend` builds into `PUBLIC/`. TODO: SPA deep-link fallback for client routes
      (a WoOF catch-all route → `index.html`) if the tests deep-link.
- [ ] **`/health` route** (`officefloor/rest/health.GET.yml` → `Health.check`) — the harness
      readiness probe (`config.yaml → app.health_url`). OfficeFloor has no Spring Actuator.
- [ ] No external services, no network egress needed to build/boot (toolchain resolvable offline
      or pre-warmed — the agent turn is Landlock-confined; note `frontend-maven-plugin` and Maven
      must have node/deps available offline or pre-fetched).

## C. Fixed operational scaffolding (PINNED — agent runs but never edits; DESIGN.md §15)

These commands must stay constant across checkpoints even as the app evolves. They are in
`config.yaml → isolation.pin_files` and restored to authored before every gate.

- [ ] `bin/build` — Maven build; `frontend-maven-plugin` builds the SPA into `PUBLIC/`, then
      `spring-boot-maven-plugin` repackages the WoOF app into `target/*.jar`.
- [ ] `bin/start` — `java -jar target/*.jar --http.port=$PORT` (main `OfficeFloorMain`); exits 0
      once launching (records pid for `bin/stop`). TODO: confirm the port flag + harness profile.
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
bin/{build,start,stop,e2e}                       # pinned scaffolding (C)
pom.xml                                           # one Maven build -> the runnable jar
src/main/java/**/*.java                           # backend (source_globs.backend)
src/main/resources/officefloor/objects/*.yml      # DataSource + Connection managed objects
src/main/resources/officefloor/suppliers/Spring.yml  # Spring supplied into OfficeFloor
src/main/resources/officefloor/rest/**/*.yml      # WoOF routes (shared_surfaces.backend); health + __test__
src/main/resources/db/migration/                  # Flyway migrations (empty at base)
src/main/resources/PUBLIC/                         # SPA build output, served by WoOF
src/main/frontend/**/*.{ts,tsx}                   # front-end source (source_globs.frontend); builds into PUBLIC/
src/main/frontend/{router,ui}/                     # shared_surfaces.frontend
e2e/{playwright.config.ts,package.json,support/}  # Playwright project (specs copied in per cp)
CLAUDE.md, AGENTS.md                               # pinned agent instructions
```

- [ ] `config.yaml → app.source_globs` / `shared_surfaces` match the real paths (so per-layer
      erosion and boundary-violation counts are correct — DESIGN.md §8).

## G. Git

- [ ] The base state lives on branch **`base-empty`** (= `config.yaml → app.base_ref`).
- [ ] `.gitignore` excludes build output (`target/`, `node_modules/`, `*.jar`, and the generated
      `src/main/resources/PUBLIC/assets/`) so the agent's committed delta is source only.
- [ ] Local repo is enough (the harness reads it by path); a remote is optional.

## H. Smoke test before wiring into a run

- [ ] From a clean `base-empty` checkout: `bin/build` → `bin/start` → `curl /health` = UP
      → shell renders → `bin/stop` frees the port.
- [ ] Drop one throwaway spec into `e2e/specs/` and confirm `bin/e2e` builds, serves, runs it, and
      stops — the whole agent-test loop end to end.
- [ ] Confirm the whole thing runs under the harness's Landlock allowlist
      (`python harness/landlock_selftest.py` in the harness repo; add toolchain binds in
      `config.yaml → isolation` as needed).
