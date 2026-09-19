// SKELETON front-end entry (BASE_CHECKLIST.md §B, §E). The base renders a bare shell: a nav frame
// and an empty home. Features are added per checkpoint as NEW files, not edits to shared surfaces.
// Every observable element/value carries a stable data-test-id (never renamed/removed).
//
// TODO: mount the app shell with the opinionated conventions from CLAUDE.md:
//   - file/manifest-based routing (adding a route = a new file under router/)
//   - no global domain store (features own their state)
//   - closed shared primitives in ui/ (composed, never branched per feature)
//   - scoped styles
//
// Example anchor the base shell should expose:
//   <nav data-test-id="app-nav"> ... </nav>

export {};
