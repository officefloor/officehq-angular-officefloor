package net.officefloor.hq.app;

// SKELETON. The per-spec seed/reset endpoint (DESIGN.md §9, BASE_CHECKLIST.md §D). This is APP
// CODE and EVOLVES with the schema (it is NOT pinned) — a change that breaks a prior spec's seed
// is a seed-path regression. It MUST be profile-guarded so it exists only under the harness launch.
//
// @Profile("harness")
// @RestController
// @RequestMapping("/__test__")
// public class TestSupportController {
//
//   // Wipe all domain tables (respecting FK order). Called from each spec's beforeEach.
//   @PostMapping("/reset")
//   public void reset() { /* TODO: TRUNCATE domain tables */ }
//
//   // Insert a fixture payload the spec needs. Shape evolves with the schema.
//   @PostMapping("/seed")
//   public void seed(@RequestBody Map<String, Object> fixture) { /* TODO: insert rows */ }
// }
//
// Tests seed via this endpoint (Arrange); they ASSERT only through the UI (never here) — the
// testing-boundary invariant (DESIGN.md §14).

final class TestSupportController {
    private TestSupportController() {}
}
