package net.officefloor.hq.app;

import java.sql.Connection;

/**
 * Per-spec data setup for the harness (DESIGN.md §9). Wired at POST /__test__/reset and
 * POST /__test__/seed. This is APP CODE and EVOLVES with the schema (NOT pinned) — a change that
 * breaks a prior spec's seed is a seed-path regression. Tests call these to ARRANGE data; they
 * ASSERT only through the UI (never here).
 *
 * TODO: guard these routes to a harness-only OfficeFloor profile so they are absent from a real
 * deploy. The {@link Connection} is injected by OfficeFloor (officefloor/objects/Connection.yml).
 */
public class TestSupport {

    /** Truncate all domain tables (respecting FK order) so each spec starts clean. */
    public void reset(Connection connection) {
        // TODO: TRUNCATE the domain tables that exist at this checkpoint.
    }

    /** Insert the fixture a spec needs. The payload shape evolves with the schema. */
    public void seed(Connection connection /* TODO: + the parsed fixture payload */) {
        // TODO: insert rows for the fixture.
    }
}
