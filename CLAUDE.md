# Working in this app

You are making ONE change to this application in response to the change request you were given.
Implement it as a **full-stack change**: whatever the request needs across the database schema,
the OfficeFloor server, and the front-end — as a small, additive, local change.

## Rules

- **`data-test-id` is immutable public API.** Expose a stable `data-test-id` on every element and
  value the feature surfaces. **Never rename or remove a `data-test-id` that already exists** — it
  is how the app is tested. Match exactly the `data-test-id` values your task's test expects.
- **Schema changes are Flyway migrations.** Add a new versioned migration under
  `src/main/resources/db/migration/`; never edit an applied migration.
- **Data is seeded through the app's own API in tests**, not committed as fixtures. If your feature
  needs new seed capability, extend the `/__test__` seed support.
- **Keep it additive and local** (this is why the app stays maintainable):
  - a new page/route is a new file, not an edit to a central router;
  - features own their own state; there is no global domain store to reach into;
  - shared UI primitives (`src/main/frontend/ui/`) are *composed*, not branched with per-feature
    `if`s;
  - features do not import each other; keep each feature's code together.
- **Do not edit** the build/run scripts (`bin/build`, `bin/start`, `bin/stop`, `bin/e2e`) or this
  file. Use `bin/e2e` to run your test as you work.

## Layout

- `src/main/frontend/**` — the front-end (TypeScript). `router/` and `ui/` are shared surfaces.
- `src/main/java/**` — the OfficeFloor server. `src/main/resources/officefloor/**` — wiring.
- `src/main/resources/db/migration/**` — Flyway migrations.
- `bin/e2e` — build, start the app, run your test, stop. Run it to check your work.
