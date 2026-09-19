# Working in this app

You are making ONE change to this application in response to the change request you were given.
Implement it as a **full-stack change**: whatever the request needs across the database schema, the
server (OfficeFloor REST on a Spring Boot host), and the React front-end — as a small, additive,
local change.

## Rules

- **`data-testid` is immutable public API.** Expose a stable `data-testid` on every element and
  value the feature surfaces. **Never rename or remove a `data-testid` that already exists** — it
  is how the app is tested. Match exactly the `data-testid` values your task's test expects.
- **Schema changes are Flyway migrations.** Add a new versioned migration under
  `src/main/resources/db/migration/`; never edit an applied migration.
- **Data is seeded through the app's own API in tests**, not committed as fixtures. If your feature
  needs new seed capability, extend the `/__test__` seed support. Seed with a `JdbcTemplate` using
  the **explicit ids from the fixture** (JPA `save()` with an IDENTITY id ignores a supplied id and
  generates its own — the spec asserts rows by the fixture's ids, so they must match). `reset`
  should `TRUNCATE ... RESTART IDENTITY` the tables it clears.
- **Audit / side-effect records go through the `Audit` service** (inject `Audit`, call
  `record(...)`). It appends one record per line to the known audit file that tests read — that is
  how audited behaviour is verified (the UI can't show it). Use the exact record text the task's
  test expects; don't invent separate logging for audited behaviour.
- **Keep it additive and local** (this is why the app stays maintainable):
  - a new page/route is a new file, not an edit to a central router;
  - features own their own state; there is no global domain store to reach into;
  - shared UI primitives (`src/main/frontend/ui/`) are *composed*, not branched with per-feature
    `if`s;
  - features do not import each other; keep each feature's code together.
- **Do not edit** the build/run scripts (`bin/build`, `bin/start`, `bin/stop`, `bin/e2e`) or this
  file. Use `bin/e2e` to run your test as you work.

## Layout

- `src/main/frontend/**` — the React front-end (TypeScript). `router/` and `ui/` are shared
  surfaces; a new page is a new file, not an edit to `router/`.
- `src/main/resources/officefloor/rest/api/<path>.<METHOD>.yml` — a REST endpoint = a **new YAML
  file** (`service: { class: net.officefloor.hq.app.<Logic> }`) + a **new logic class** whose
  `service(...)` method takes injected Spring beans/data + `ObjectResponse<T>` (and, for a body,
  a param with `@RequestBody`). Additive: one file per endpoint, never a central router. **Put
  domain routes under `rest/api/`** so their paths start with `/api/` — `SpaConfig` only lets
  `/api/*` bypass the SPA deep-link fallback; a non-`/api/` route is swallowed and returns the
  SPA HTML instead of your endpoint.
- `src/main/java/**` — logic classes and Spring `@Service`/`@Repository` beans (business logic +
  data access). `Application`, `SpaConfig`, `TestSupportController` are base infrastructure.
- `src/main/resources/db/migration/**` — Flyway migrations (new `V<n>__*.sql` per schema change).
- `bin/e2e` — build, start the app, run your test, stop. Run it to check your work.
